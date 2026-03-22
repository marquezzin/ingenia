"""Seed management command — popula o banco com dados iniciais."""

from django.core.management.base import BaseCommand

from ._seed_content import (
    _MD_COND_1,
    _MD_COND_2,
    _MD_FUNC_1,
    _MD_FUNC_2,
    _MD_INTRO_1,
    _MD_INTRO_2,
    _MD_LIST_1,
    _MD_LIST_2,
    _MD_LOOP_1,
    _MD_LOOP_2,
    _MD_VARS_1,
    _MD_VARS_2,
    _MD_VARS_3,
)


class Command(BaseCommand):
    help = "Popula o banco de dados com dados iniciais para desenvolvimento."

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Limpa os dados existentes antes de popular.",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            self.stdout.write(self.style.WARNING("Limpando dados existentes..."))
            self._clear_data()

        self.stdout.write("Populando banco de dados...")
        self._seed_users()
        self._seed_curriculum()
        self._seed_classes()
        self._seed_progress_and_submissions()
        self.stdout.write(self.style.SUCCESS("Banco populado com sucesso!"))

    def _clear_data(self):
        """Limpa dados de desenvolvimento (preserva superusuários)."""
        from src.accounts.models import User
        from src.classes.models import ClassGroup
        from src.curriculum.models import Module

        # Remove Module e ClassGroup, o que propaga cascata (quando applicavel)
        # e garante evitar erro de UniqueConstraints.
        Module.objects.all().delete()
        ClassGroup.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()
        self.stdout.write("  Dados limpos.")

    def _seed_users(self):
        """Cria usuários de desenvolvimento com roles e profiles."""
        from src.accounts.enums import AccountStatus, UserRole
        from src.accounts.models import (
            AdminProfile,
            StudentProfile,
            TeacherProfile,
            User,
        )

        # Admin
        admin, created = User.objects.get_or_create(
            email="admin@hub.dev",
            defaults={
                "first_name": "Admin",
                "last_name": "Hub",
                "role": UserRole.ADMIN,
                "account_status": AccountStatus.ACTIVE,
                "is_staff": True,
                "is_superuser": True,
            },
        )
        if created:
            admin.set_password("admin123")
            admin.save()
            self.stdout.write("  ✓ Superusuário criado: admin@hub.dev / admin123")
        else:
            # Atualiza role caso já exista sem o role correto
            if admin.role != UserRole.ADMIN:
                admin.role = UserRole.ADMIN
                admin.save(update_fields=["role"])
            self.stdout.write("  - Superusuário já existe.")

        AdminProfile.objects.get_or_create(user=admin)

        # Professor
        teacher_user, created_teacher = User.objects.get_or_create(
            email="teacher1@hub.dev",
            defaults={
                "first_name": "Professor",
                "last_name": "Teste",
                "role": UserRole.TEACHER,
                "account_status": AccountStatus.ACTIVE,
            },
        )
        if created_teacher:
            teacher_user.set_password("teacher123")
            teacher_user.save()
            self.stdout.write("  ✓ Professor criado: teacher1@hub.dev / teacher123")
        else:
            self.stdout.write("  - Professor já existe.")

        TeacherProfile.objects.get_or_create(user=teacher_user)

        # Alunos (1 -> user@hub.dev, mais dois)
        students = [
            ("user@hub.dev", "Usuário"),
            ("student2@hub.dev", "Aluno 2"),
            ("student3@hub.dev", "Aluno 3"),
        ]

        for email, first_name in students:
            student, student_created = User.objects.get_or_create(
                email=email,
                defaults={
                    "first_name": first_name,
                    "last_name": "Teste",
                    "role": UserRole.STUDENT,
                    "account_status": AccountStatus.ACTIVE,
                },
            )
            if student_created:
                student.set_password("user123")
                student.save()
                self.stdout.write(f"  ✓ Aluno criado: {email} / user123")
            else:
                self.stdout.write(f"  - Aluno {email} já existe.")

            StudentProfile.objects.get_or_create(user=student)

    def _seed_curriculum(self):
        """Cria módulos, aulas, vídeos e exercícios — Trilha Python Iniciante."""
        from src.curriculum.enums import ContentStatus
        from src.curriculum.models import (
            Exercise,
            ExerciseTestCase,
            Lesson,
            Module,
            VideoLesson,
        )

        self.stdout.write("  Criando currículo — Trilha Python para Iniciantes...")

        video_url = "https://www.youtube.com/watch?v=DXmCU7v9glM"

        modules_data = self._get_curriculum_data()

        for m in modules_data:
            module, _ = Module.objects.get_or_create(
                sequence_order=m["order"],
                defaults={
                    "title": m["title"],
                    "description": m["description"],
                    "publication_status": ContentStatus.PUBLISHED,
                },
            )

            for lesson_data in m["lessons"]:
                lesson, _ = Lesson.objects.get_or_create(
                    module=module,
                    sequence_order=lesson_data["order"],
                    defaults={
                        "title": lesson_data["title"],
                        "written_content": lesson_data["content"],
                        "publication_status": ContentStatus.PUBLISHED,
                    },
                )

                VideoLesson.objects.get_or_create(
                    lesson=lesson,
                    defaults={
                        "title": f"Vídeo — {lesson_data['title']}",
                        "video_url": video_url,
                        "duration_seconds": 900,
                    },
                )

                for ex in lesson_data["exercises"]:
                    exercise, _ = Exercise.objects.get_or_create(
                        lesson=lesson,
                        sequence_order=ex["order"],
                        defaults={
                            "title": ex["title"],
                            "statement": ex["statement"],
                            "support_message": ex["hint"],
                            "publication_status": ContentStatus.PUBLISHED,
                        },
                    )

                    for tc in ex["test_cases"]:
                        ExerciseTestCase.objects.get_or_create(
                            exercise=exercise,
                            sequence_order=tc["order"],
                            defaults={
                                "name": tc["name"],
                                "input_data": tc["input"],
                                "expected_output": tc["output"],
                                "is_hidden": tc.get("hidden", False),
                            },
                        )

        self.stdout.write("  ✓ Currículo criado com sucesso.")

    # ------------------------------------------------------------------
    # Dados do currículo
    # ------------------------------------------------------------------

    def _get_curriculum_data(self):  # noqa: C901 PLR0915
        """Retorna a estrutura completa da trilha Python para iniciantes."""
        return [
            # ── Módulo 1: Introdução ao Python ───────────────────────
            {
                "order": 1,
                "title": "Introdução ao Python",
                "description": "Primeiros passos com a linguagem Python: história, instalação e seu primeiro programa.",
                "lessons": [
                    {
                        "order": 1,
                        "title": "O que é Python?",
                        "content": _MD_INTRO_1,
                        "exercises": [
                            {
                                "order": 1,
                                "title": "Olá, Mundo!",
                                "statement": "Escreva um programa que imprima exatamente a frase:\n`Olá, Mundo!`",
                                "hint": "Use a função `print()` com a string entre aspas.",
                                "test_cases": [
                                    {
                                        "order": 1,
                                        "name": "Saída padrão",
                                        "input": "",
                                        "output": "Olá, Mundo!",
                                    },
                                    {
                                        "order": 2,
                                        "name": "Sem entrada",
                                        "input": "",
                                        "output": "Olá, Mundo!",
                                        "hidden": True,
                                    },
                                ],
                            },
                            {
                                "order": 2,
                                "title": "Apresentação pessoal",
                                "statement": "Leia o nome do usuário com `input()` e imprima:\n`Prazer em conhecer, <nome>!`",
                                "hint": "Use `input()` para ler o nome e `print()` com f-string para formatar.",
                                "test_cases": [
                                    {
                                        "order": 1,
                                        "name": "Nome simples",
                                        "input": "Maria",
                                        "output": "Prazer em conhecer, Maria!",
                                    },
                                    {
                                        "order": 2,
                                        "name": "Outro nome",
                                        "input": "João",
                                        "output": "Prazer em conhecer, João!",
                                        "hidden": True,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        "order": 2,
                        "title": "Instalação e Ambiente",
                        "content": _MD_INTRO_2,
                        "exercises": [
                            {
                                "order": 1,
                                "title": "Verificando a versão",
                                "statement": "Escreva um programa que imprima a versão do Python no formato:\n`Python X.Y.Z`\n\nUse `sys.version_info` para obter major, minor e micro.",
                                "hint": "Importe `sys` e acesse `sys.version_info.major`, `.minor`, `.micro`.",
                                "test_cases": [
                                    {
                                        "order": 1,
                                        "name": "Formato correto",
                                        "input": "",
                                        "output": "Python 3.14.0",
                                    },
                                    {
                                        "order": 2,
                                        "name": "Verificação",
                                        "input": "",
                                        "output": "Python 3.14.0",
                                        "hidden": True,
                                    },
                                ],
                            },
                            {
                                "order": 2,
                                "title": "Calculadora simples",
                                "statement": "Leia dois números inteiros (um por linha) e imprima a soma deles.",
                                "hint": "Use `int(input())` para ler cada número e `print()` para mostrar o resultado.",
                                "test_cases": [
                                    {
                                        "order": 1,
                                        "name": "Soma positiva",
                                        "input": "3\n5",
                                        "output": "8",
                                    },
                                    {
                                        "order": 2,
                                        "name": "Soma com negativo",
                                        "input": "10\n-4",
                                        "output": "6",
                                        "hidden": True,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            # ── Módulo 2: Variáveis e Tipos de Dados ─────────────────
            {
                "order": 2,
                "title": "Variáveis e Tipos de Dados",
                "description": "Aprenda sobre variáveis, tipos numéricos, strings e conversão de tipos em Python.",
                "lessons": [
                    {
                        "order": 1,
                        "title": "Variáveis e Atribuição",
                        "content": _MD_VARS_1,
                        "exercises": [
                            {
                                "order": 1,
                                "title": "Troca de variáveis",
                                "statement": "Leia dois valores (um por linha) e imprima-os em ordem invertida, um por linha.",
                                "hint": "Leia os dois valores e imprima o segundo primeiro.",
                                "test_cases": [
                                    {
                                        "order": 1,
                                        "name": "Troca simples",
                                        "input": "A\nB",
                                        "output": "B\nA",
                                    },
                                    {
                                        "order": 2,
                                        "name": "Números",
                                        "input": "1\n2",
                                        "output": "2\n1",
                                        "hidden": True,
                                    },
                                ],
                            },
                            {
                                "order": 2,
                                "title": "Tipo de dado",
                                "statement": "Leia um valor com `input()` e imprima o tipo dele usando `type()`. Exemplo de saída:\n`<class 'str'>`",
                                "hint": "O `input()` sempre retorna uma string. Use `print(type(valor))`.",
                                "test_cases": [
                                    {
                                        "order": 1,
                                        "name": "Tipo string",
                                        "input": "hello",
                                        "output": "<class 'str'>",
                                    },
                                    {
                                        "order": 2,
                                        "name": "Número como string",
                                        "input": "42",
                                        "output": "<class 'str'>",
                                        "hidden": True,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        "order": 2,
                        "title": "Tipos Numéricos e Operações",
                        "content": _MD_VARS_2,
                        "exercises": [
                            {
                                "order": 1,
                                "title": "Área do retângulo",
                                "statement": "Leia a base e a altura (inteiros, um por linha) e imprima a área do retângulo.",
                                "hint": "Área = base × altura. Leia com `int(input())`.",
                                "test_cases": [
                                    {
                                        "order": 1,
                                        "name": "Retângulo 5x3",
                                        "input": "5\n3",
                                        "output": "15",
                                    },
                                    {
                                        "order": 2,
                                        "name": "Retângulo 7x2",
                                        "input": "7\n2",
                                        "output": "14",
                                        "hidden": True,
                                    },
                                ],
                            },
                            {
                                "order": 2,
                                "title": "Divisão inteira e resto",
                                "statement": "Leia dois inteiros (dividendo e divisor) e imprima, em linhas separadas, o quociente da divisão inteira e o resto.",
                                "hint": "Use `//` para divisão inteira e `%` para resto.",
                                "test_cases": [
                                    {
                                        "order": 1,
                                        "name": "10 / 3",
                                        "input": "10\n3",
                                        "output": "3\n1",
                                    },
                                    {
                                        "order": 2,
                                        "name": "17 / 5",
                                        "input": "17\n5",
                                        "output": "3\n2",
                                        "hidden": True,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        "order": 3,
                        "title": "Strings e Formatação",
                        "content": _MD_VARS_3,
                        "exercises": [
                            {
                                "order": 1,
                                "title": "Iniciais do nome",
                                "statement": "Leia o nome completo (ex: `João Silva`) e imprima as iniciais separadas por ponto.\nExemplo: entrada `João Silva` → saída `J.S`",
                                "hint": "Use `.split()` para separar as palavras e acesse o primeiro caractere de cada.",
                                "test_cases": [
                                    {
                                        "order": 1,
                                        "name": "Duas palavras",
                                        "input": "João Silva",
                                        "output": "J.S",
                                    },
                                    {
                                        "order": 2,
                                        "name": "Três palavras",
                                        "input": "Ana Maria Costa",
                                        "output": "A.M.C",
                                        "hidden": True,
                                    },
                                ],
                            },
                            {
                                "order": 2,
                                "title": "Contagem de caracteres",
                                "statement": "Leia uma string e imprima a quantidade de caracteres dela.",
                                "hint": "Use a função `len()`.",
                                "test_cases": [
                                    {
                                        "order": 1,
                                        "name": "Palavra curta",
                                        "input": "Python",
                                        "output": "6",
                                    },
                                    {
                                        "order": 2,
                                        "name": "Frase",
                                        "input": "Olá Mundo",
                                        "output": "9",
                                        "hidden": True,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            # ── Módulo 3: Estruturas Condicionais ────────────────────
            {
                "order": 3,
                "title": "Estruturas Condicionais",
                "description": "Domine o fluxo do seu programa com if, elif, else e operadores de comparação.",
                "lessons": [
                    {
                        "order": 1,
                        "title": "if, elif e else",
                        "content": _MD_COND_1,
                        "exercises": [
                            {
                                "order": 1,
                                "title": "Par ou ímpar",
                                "statement": "Leia um número inteiro e imprima `par` se for par ou `impar` se for ímpar.",
                                "hint": "Um número é par quando o resto da divisão por 2 é zero (`n % 2 == 0`).",
                                "test_cases": [
                                    {
                                        "order": 1,
                                        "name": "Número par",
                                        "input": "4",
                                        "output": "par",
                                    },
                                    {
                                        "order": 2,
                                        "name": "Número ímpar",
                                        "input": "7",
                                        "output": "impar",
                                        "hidden": True,
                                    },
                                ],
                            },
                            {
                                "order": 2,
                                "title": "Classificação de idade",
                                "statement": "Leia a idade (inteiro) e imprima:\n- `crianca` se idade < 12\n- `adolescente` se 12 ≤ idade < 18\n- `adulto` se idade ≥ 18",
                                "hint": "Use `if/elif/else` para verificar as faixas.",
                                "test_cases": [
                                    {
                                        "order": 1,
                                        "name": "Criança",
                                        "input": "8",
                                        "output": "crianca",
                                    },
                                    {
                                        "order": 2,
                                        "name": "Adolescente",
                                        "input": "15",
                                        "output": "adolescente",
                                        "hidden": True,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        "order": 2,
                        "title": "Operadores de Comparação e Lógicos",
                        "content": _MD_COND_2,
                        "exercises": [
                            {
                                "order": 1,
                                "title": "Maior de três",
                                "statement": "Leia três números inteiros (um por linha) e imprima o maior deles.",
                                "hint": "Você pode usar a função `max()` ou comparar com `if/elif`.",
                                "test_cases": [
                                    {
                                        "order": 1,
                                        "name": "Ordem crescente",
                                        "input": "1\n2\n3",
                                        "output": "3",
                                    },
                                    {
                                        "order": 2,
                                        "name": "Maior no meio",
                                        "input": "5\n9\n3",
                                        "output": "9",
                                        "hidden": True,
                                    },
                                ],
                            },
                            {
                                "order": 2,
                                "title": "Aprovação em disciplina",
                                "statement": "Leia a nota (float) e a frequência em % (int). Imprima `aprovado` se nota ≥ 7.0 **e** frequência ≥ 75, senão imprima `reprovado`.",
                                "hint": "Use `and` para combinar as duas condições.",
                                "test_cases": [
                                    {
                                        "order": 1,
                                        "name": "Aprovado",
                                        "input": "8.5\n80",
                                        "output": "aprovado",
                                    },
                                    {
                                        "order": 2,
                                        "name": "Reprovado por falta",
                                        "input": "9.0\n60",
                                        "output": "reprovado",
                                        "hidden": True,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            # ── Módulo 4: Estruturas de Repetição ────────────────────
            {
                "order": 4,
                "title": "Estruturas de Repetição",
                "description": "Aprenda a usar while e for para repetir tarefas e iterar sobre sequências.",
                "lessons": [
                    {
                        "order": 1,
                        "title": "Laço while",
                        "content": _MD_LOOP_1,
                        "exercises": [
                            {
                                "order": 1,
                                "title": "Contagem regressiva",
                                "statement": "Leia um número inteiro N e imprima uma contagem regressiva de N até 1, cada número em uma linha.",
                                "hint": "Use `while n > 0` e decremente `n` a cada iteração.",
                                "test_cases": [
                                    {
                                        "order": 1,
                                        "name": "De 5",
                                        "input": "5",
                                        "output": "5\n4\n3\n2\n1",
                                    },
                                    {
                                        "order": 2,
                                        "name": "De 3",
                                        "input": "3",
                                        "output": "3\n2\n1",
                                        "hidden": True,
                                    },
                                ],
                            },
                            {
                                "order": 2,
                                "title": "Soma até zero",
                                "statement": "Leia números inteiros um por linha até que o número 0 seja digitado. Imprima a soma de todos os números lidos (sem incluir o 0).",
                                "hint": "Use um loop `while True` e `break` quando ler 0.",
                                "test_cases": [
                                    {
                                        "order": 1,
                                        "name": "Soma básica",
                                        "input": "3\n5\n2\n0",
                                        "output": "10",
                                    },
                                    {
                                        "order": 2,
                                        "name": "Com negativos",
                                        "input": "10\n-3\n5\n0",
                                        "output": "12",
                                        "hidden": True,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        "order": 2,
                        "title": "Laço for e range()",
                        "content": _MD_LOOP_2,
                        "exercises": [
                            {
                                "order": 1,
                                "title": "Tabuada",
                                "statement": "Leia um número inteiro N e imprima a tabuada de N de 1 a 10, no formato `N x i = resultado`, uma por linha.",
                                "hint": "Use `for i in range(1, 11)` e f-strings para formatar.",
                                "test_cases": [
                                    {
                                        "order": 1,
                                        "name": "Tabuada do 3",
                                        "input": "3",
                                        "output": "3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30",
                                    },
                                    {
                                        "order": 2,
                                        "name": "Tabuada do 5",
                                        "input": "5",
                                        "output": "5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50",
                                        "hidden": True,
                                    },
                                ],
                            },
                            {
                                "order": 2,
                                "title": "Fatorial",
                                "statement": "Leia um número inteiro N (≥ 0) e imprima o fatorial de N.",
                                "hint": "Use um `for` acumulando o produto. Lembre que 0! = 1.",
                                "test_cases": [
                                    {
                                        "order": 1,
                                        "name": "Fatorial de 5",
                                        "input": "5",
                                        "output": "120",
                                    },
                                    {
                                        "order": 2,
                                        "name": "Fatorial de 0",
                                        "input": "0",
                                        "output": "1",
                                        "hidden": True,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            # ── Módulo 5: Funções ────────────────────────────────────
            {
                "order": 5,
                "title": "Funções",
                "description": "Organize e reutilize seu código criando funções com parâmetros e retorno.",
                "lessons": [
                    {
                        "order": 1,
                        "title": "Definindo Funções",
                        "content": _MD_FUNC_1,
                        "exercises": [
                            {
                                "order": 1,
                                "title": "Função de saudação",
                                "statement": "Crie uma função `saudacao(nome)` que retorne a string `Olá, <nome>!`. Leia um nome e imprima o resultado da função.",
                                "hint": "Defina a função com `def saudacao(nome):` e use `return`.",
                                "test_cases": [
                                    {
                                        "order": 1,
                                        "name": "Nome simples",
                                        "input": "Ana",
                                        "output": "Olá, Ana!",
                                    },
                                    {
                                        "order": 2,
                                        "name": "Outro nome",
                                        "input": "Pedro",
                                        "output": "Olá, Pedro!",
                                        "hidden": True,
                                    },
                                ],
                            },
                            {
                                "order": 2,
                                "title": "Função é primo",
                                "statement": "Crie uma função `eh_primo(n)` que retorne `True` se n for primo e `False` caso contrário. Leia um inteiro e imprima o resultado.",
                                "hint": "Um número é primo se é divisível apenas por 1 e por ele mesmo. Teste divisores de 2 até √n.",
                                "test_cases": [
                                    {
                                        "order": 1,
                                        "name": "Primo",
                                        "input": "7",
                                        "output": "True",
                                    },
                                    {
                                        "order": 2,
                                        "name": "Não primo",
                                        "input": "10",
                                        "output": "False",
                                        "hidden": True,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        "order": 2,
                        "title": "Parâmetros e Retorno",
                        "content": _MD_FUNC_2,
                        "exercises": [
                            {
                                "order": 1,
                                "title": "Calculadora com funções",
                                "statement": "Leia dois floats e uma operação (+, -, *, /). Imprima o resultado com 2 casas decimais. Use uma função para cada operação.",
                                "hint": "Crie funções `soma`, `sub`, `mult`, `div` e use `if/elif` para selecionar.",
                                "test_cases": [
                                    {
                                        "order": 1,
                                        "name": "Soma",
                                        "input": "3.0\n2.0\n+",
                                        "output": "5.00",
                                    },
                                    {
                                        "order": 2,
                                        "name": "Divisão",
                                        "input": "7.0\n2.0\n/",
                                        "output": "3.50",
                                        "hidden": True,
                                    },
                                ],
                            },
                            {
                                "order": 2,
                                "title": "Fibonacci",
                                "statement": "Crie uma função `fibonacci(n)` que retorne o n-ésimo termo da sequência de Fibonacci (começando em 0). Leia um inteiro e imprima o resultado.\n\nExemplo: fibonacci(6) → 8 (sequência: 0, 1, 1, 2, 3, 5, **8**)",
                                "hint": "Use um loop para calcular iterativamente, começando com a=0 e b=1.",
                                "test_cases": [
                                    {
                                        "order": 1,
                                        "name": "fibonacci(6)",
                                        "input": "6",
                                        "output": "8",
                                    },
                                    {
                                        "order": 2,
                                        "name": "fibonacci(10)",
                                        "input": "10",
                                        "output": "55",
                                        "hidden": True,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            # ── Módulo 6: Listas e Estruturas de Dados ───────────────
            {
                "order": 6,
                "title": "Listas e Estruturas de Dados",
                "description": "Trabalhe com coleções de dados usando listas, operações e list comprehension.",
                "lessons": [
                    {
                        "order": 1,
                        "title": "Listas em Python",
                        "content": _MD_LIST_1,
                        "exercises": [
                            {
                                "order": 1,
                                "title": "Soma da lista",
                                "statement": "Leia N (inteiro), depois leia N números inteiros (um por linha). Imprima a soma de todos.",
                                "hint": "Use um `for` para ler os números e acumule a soma, ou use `sum()`.",
                                "test_cases": [
                                    {
                                        "order": 1,
                                        "name": "Soma 3 números",
                                        "input": "3\n10\n20\n30",
                                        "output": "60",
                                    },
                                    {
                                        "order": 2,
                                        "name": "Soma 4 números",
                                        "input": "4\n1\n2\n3\n4",
                                        "output": "10",
                                        "hidden": True,
                                    },
                                ],
                            },
                            {
                                "order": 2,
                                "title": "Inverter lista",
                                "statement": "Leia N, depois N inteiros. Imprima-os em ordem inversa, separados por espaço.",
                                "hint": "Use slicing `[::-1]` ou o método `.reverse()`.",
                                "test_cases": [
                                    {
                                        "order": 1,
                                        "name": "Inversão",
                                        "input": "4\n1\n2\n3\n4",
                                        "output": "4 3 2 1",
                                    },
                                    {
                                        "order": 2,
                                        "name": "Três itens",
                                        "input": "3\n10\n20\n30",
                                        "output": "30 20 10",
                                        "hidden": True,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        "order": 2,
                        "title": "List Comprehension",
                        "content": _MD_LIST_2,
                        "exercises": [
                            {
                                "order": 1,
                                "title": "Quadrados perfeitos",
                                "statement": "Leia um inteiro N e imprima os quadrados de 1 até N, separados por espaço. Use list comprehension.",
                                "hint": "Use `[i**2 for i in range(1, n+1)]` e `' '.join()` para formatar.",
                                "test_cases": [
                                    {
                                        "order": 1,
                                        "name": "Até 5",
                                        "input": "5",
                                        "output": "1 4 9 16 25",
                                    },
                                    {
                                        "order": 2,
                                        "name": "Até 3",
                                        "input": "3",
                                        "output": "1 4 9",
                                        "hidden": True,
                                    },
                                ],
                            },
                            {
                                "order": 2,
                                "title": "Filtrar pares",
                                "statement": "Leia N, depois N inteiros. Imprima apenas os números pares, separados por espaço. Se não houver pares, imprima `nenhum`.",
                                "hint": "Use list comprehension com condição: `[x for x in lista if x % 2 == 0]`.",
                                "test_cases": [
                                    {
                                        "order": 1,
                                        "name": "Com pares",
                                        "input": "5\n1\n2\n3\n4\n5",
                                        "output": "2 4",
                                    },
                                    {
                                        "order": 2,
                                        "name": "Sem pares",
                                        "input": "3\n1\n3\n5",
                                        "output": "nenhum",
                                        "hidden": True,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ]

    def _seed_classes(self):
        """Cria turma de exemplo e matricula os alunos."""
        from django.utils import timezone

        from src.accounts.models import StudentProfile, TeacherProfile
        from src.classes.enums import ClassStatus, EnrollmentStatus
        from src.classes.models import ClassEnrollment, ClassGroup

        self.stdout.write("  Criando turmas...")

        teacher_profile = TeacherProfile.objects.first()
        if not teacher_profile:
            return

        class_group, _ = ClassGroup.objects.get_or_create(
            teacher_profile=teacher_profile,
            name="Turma A - 2026",
            defaults={
                "description": "Turma intro",
                "class_status": ClassStatus.ACTIVE,
            },
        )

        students = StudentProfile.objects.all()
        for student in students:
            ClassEnrollment.objects.get_or_create(
                class_group=class_group,
                student_profile=student,
                defaults={
                    "enrolled_at": timezone.now(),
                    "enrollment_status": EnrollmentStatus.ACTIVE,
                },
            )

    def _seed_progress_and_submissions(self):
        """Gera algumas submissões e progresso para o primeiro aluno do seed."""
        from django.utils import timezone

        from src.accounts.models import StudentProfile
        from src.curriculum.models import Exercise, Lesson, Module
        from src.progress.enums import ProgressStatus
        from src.progress.models import (
            StudentExerciseProgress,
            StudentLessonProgress,
            StudentModuleProgress,
        )
        from src.submissions.enums import ResultStatus, SubmissionStatus
        from src.submissions.models import Submission, SubmissionResult

        self.stdout.write("  Criando progresso e submissões...")

        student = StudentProfile.objects.filter(user__email="user@hub.dev").first()
        if not student:
            return

        first_module = Module.objects.first()
        if not first_module:
            return

        # Popula o progresso de módulo
        StudentModuleProgress.objects.get_or_create(
            student_profile=student,
            module=first_module,
            defaults={
                "progress_status": ProgressStatus.IN_PROGRESS,
                "started_at": timezone.now(),
            },
        )

        # Atualiza a primeira aula
        first_lesson = Lesson.objects.filter(module=first_module).first()
        if first_lesson:
            StudentLessonProgress.objects.get_or_create(
                student_profile=student,
                lesson=first_lesson,
                defaults={
                    "progress_status": ProgressStatus.COMPLETED,
                    "started_at": timezone.now(),
                    "completed_at": timezone.now(),
                },
            )

        # Pega uns exercícios da primeira aula para simular sumissao
        exercises = Exercise.objects.filter(lesson=first_lesson)
        for i, exercise in enumerate(exercises):
            # 1 falha, 1 sucesso
            is_success = i % 2 == 0

            sub_status = SubmissionStatus.EVALUATED
            res_status = ResultStatus.PASSED if is_success else ResultStatus.FAILED

            submission = Submission.objects.create(
                exercise=exercise,
                student_profile=student,
                source_code="print('hello')",
                evaluation_status=sub_status,
                score_percentage=100.0 if is_success else 50.0,
                submitted_at=timezone.now(),
            )

            SubmissionResult.objects.create(
                submission=submission,
                passed_tests_count=2 if is_success else 1,
                failed_tests_count=0 if is_success else 1,
                feedback_message="Boa!" if is_success else "Revise a lógica",
                result_status=res_status,
            )

            StudentExerciseProgress.objects.get_or_create(
                student_profile=student,
                exercise=exercise,
                defaults={
                    "progress_status": ProgressStatus.COMPLETED
                    if is_success
                    else ProgressStatus.IN_PROGRESS,
                    "attempts_count": 1,
                    "first_attempt_at": timezone.now(),
                    "completed_at": timezone.now() if is_success else None,
                },
            )
