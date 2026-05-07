"""Re-popula um módulo do currículo cirurgicamente, pelo ID.

Apaga todas as Lessons (e seus Exercises/TestCases por cascata) do módulo
indicado e recria a partir dos dados do `seed.py`. Não toca em outros módulos,
usuários, turmas ou submissões fora desse módulo.

Uso:
    python manage.py reseed_curriculum_module <module_id> --order <N>

`<order>` é o `sequence_order` do módulo no `_get_curriculum_data()` do seed
(ex.: 5 para o módulo de Funções). É exigido junto com o ID para evitar
re-popular o módulo errado por engano.
"""

import uuid

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from .seed import Command as SeedCommand


class Command(BaseCommand):
    help = (
        "Apaga e recria um módulo do currículo (lessons/exercises/test cases) "
        "a partir dos dados do seed, sem afetar outros dados."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "module_id",
            type=str,
            help="UUID do Module a ser re-populado.",
        )
        parser.add_argument(
            "--order",
            type=int,
            required=True,
            help="sequence_order do módulo no seed (ex.: 5 para Funções).",
        )
        parser.add_argument(
            "--yes",
            action="store_true",
            help="Pula a confirmação interativa.",
        )

    def handle(self, *args, **options):
        from src.curriculum.enums import ContentStatus
        from src.curriculum.models import (
            Exercise,
            ExerciseTestCase,
            Lesson,
            Module,
            VideoLesson,
        )

        module_id_raw: str = options["module_id"]
        order: int = options["order"]

        try:
            module_id = uuid.UUID(module_id_raw)
        except ValueError as exc:
            raise CommandError(
                f"module_id inválido (não é UUID): {module_id_raw}"
            ) from exc

        try:
            module = Module.objects.get(id=module_id)
        except Module.DoesNotExist as exc:
            raise CommandError(f"Module {module_id} não encontrado.") from exc

        if module.sequence_order != order:
            raise CommandError(
                f"Módulo {module_id} tem sequence_order={module.sequence_order}, "
                f"mas você passou --order {order}. Abortando para evitar erro."
            )

        modules_data = SeedCommand()._get_curriculum_data()
        match = next((m for m in modules_data if m["order"] == order), None)
        if match is None:
            raise CommandError(f"Não há dados de seed para sequence_order={order}.")

        n_lessons = Lesson.objects.filter(module=module).count()
        n_exercises = Exercise.objects.filter(lesson__module=module).count()
        n_testcases = ExerciseTestCase.objects.filter(
            exercise__lesson__module=module
        ).count()

        self.stdout.write(
            self.style.WARNING(
                f"Você vai APAGAR e recriar o módulo:\n"
                f"  ID:    {module.id}\n"
                f"  Title: {module.title}\n"
                f"  Order: {module.sequence_order}\n"
                f"\n"
                f"Conteúdo atual a ser destruído:\n"
                f"  - {n_lessons} Lessons\n"
                f"  - {n_exercises} Exercises\n"
                f"  - {n_testcases} ExerciseTestCases\n"
                f"  - Submissões/Progresso vinculados (cascata)\n"
            )
        )

        if not options["yes"]:
            confirm = (
                input("Confirmar? (digite 'sim' para prosseguir): ").strip().lower()
            )
            if confirm != "sim":
                self.stdout.write(self.style.NOTICE("Abortado."))
                return

        video_url = "https://www.youtube.com/watch?v=DXmCU7v9glM"

        with transaction.atomic():
            Lesson.objects.filter(module=module).delete()

            module.title = match["title"]
            module.description = match["description"]
            module.publication_status = ContentStatus.PUBLISHED
            module.save(update_fields=["title", "description", "publication_status"])

            for lesson_data in match["lessons"]:
                lesson = Lesson.objects.create(
                    module=module,
                    sequence_order=lesson_data["order"],
                    title=lesson_data["title"],
                    written_content=lesson_data["content"],
                    publication_status=ContentStatus.PUBLISHED,
                )

                VideoLesson.objects.create(
                    lesson=lesson,
                    title=f"Vídeo — {lesson_data['title']}",
                    video_url=video_url,
                    duration_seconds=900,
                )

                for ex in lesson_data["exercises"]:
                    exercise = Exercise.objects.create(
                        lesson=lesson,
                        sequence_order=ex["order"],
                        title=ex["title"],
                        statement=ex["statement"],
                        support_message=ex["hint"],
                        publication_status=ContentStatus.PUBLISHED,
                    )

                    for tc in ex["test_cases"]:
                        ExerciseTestCase.objects.create(
                            exercise=exercise,
                            sequence_order=tc["order"],
                            name=tc["name"],
                            input_data=tc["input"],
                            expected_output=tc["output"],
                            is_hidden=tc.get("hidden", False),
                        )

        new_lessons = Lesson.objects.filter(module=module).count()
        new_exercises = Exercise.objects.filter(lesson__module=module).count()
        new_testcases = ExerciseTestCase.objects.filter(
            exercise__lesson__module=module
        ).count()

        self.stdout.write(
            self.style.SUCCESS(
                f"\n✓ Módulo recriado:\n"
                f"  - {new_lessons} Lessons\n"
                f"  - {new_exercises} Exercises\n"
                f"  - {new_testcases} ExerciseTestCases\n"
            )
        )
