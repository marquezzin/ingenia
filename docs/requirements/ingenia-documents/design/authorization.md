# Authorization

# Plataforma de Ensino Introdutório de Programação — Authorization Matrix

## 1. System Roles

| Role | Description | Hierarchy | Default |
|------|-------------|-----------|---------|
| Administrador | Perfil com controle global da plataforma. Pode gerenciar usuários, módulos, aulas, conteúdos, exercícios e acompanhar o funcionamento geral do sistema. | — | No |
| Professor | Perfil voltado ao acompanhamento pedagógico. Pode gerenciar turmas e consultar o progresso de alunos sob sua responsabilidade. | — | No |
| Aluno | Perfil principal da experiência de aprendizagem. Pode acessar conteúdos, resolver exercícios, submeter código e acompanhar o próprio progresso. | — | Yes |

### Observações sobre hierarquia
- Os documentos de descoberta indicam **RBAC com três perfis principais**: aluno, professor e administrador.
- **Não há definição explícita de herança entre papéis** no material disponível. Portanto, para o MVP, a recomendação é tratar os papéis como **independentes**, sem inheritance automática.
- O papel padrão para novos usuários foi inferido como **Aluno**, por ser o perfil principal da experiência e o único compatível com eventual uso individual em casa.  
  **Assunção:** isso deve ser validado com o cliente, pois há uma questão em aberto sobre auto-cadastro de alunos.

## 2. Protected Resources

Todos os recursos abaixo foram derivados das entidades e capacidades descritas no Domain Model, Scope, Spec e Stakeholders & Roles.

| Resource | Create | Read | Update | Delete |
|----------|--------|------|--------|--------|
| User | ✅ | ✅ | ✅ | ✅ |
| StudentProfile | ✅ | ✅ | ✅ | ✅ |
| TeacherProfile | ✅ | ✅ | ✅ | ✅ |
| AdminProfile | ✅ | ✅ | ✅ | ✅ |
| Class | ✅ | ✅ | ✅ | ✅ |
| ClassMembership | ✅ | ✅ | ✅ | ✅ |
| Module | ✅ | ✅ | ✅ | ✅ |
| Lesson | ✅ | ✅ | ✅ | ✅ |
| WrittenContent | ✅ | ✅ | ✅ | ✅ |
| Video | ✅ | ✅ | ✅ | ✅ |
| Exercise | ✅ | ✅ | ✅ | ✅ |
| CorrectionTest | ✅ | ✅ | ✅ | ✅ |
| Submission | ✅ | ✅ | ✅ | ✅ |
| EvaluationResult | ✅ | ✅ | ✅ | ✅ |
| Progress | ✅ | ✅ | ✅ | ✅ |

### Notas de mapeamento
- **User, StudentProfile, TeacherProfile** vêm diretamente do Domain Model e Spec.
- **AdminProfile** foi incluído para completar a simetria operacional do modelo de perfis citado no Spec, embora não tenha atributos detalhados no trecho disponível do Domain Model.
- **Class** corresponde à entidade **Turma**.
- **ClassMembership** representa a associação entre alunos e turmas, necessária para viabilizar “gestão de turmas”.
- **WrittenContent** corresponde ao **conteúdo escrito** de apoio vinculado à aula.
- **CorrectionTest** corresponde ao **teste de correção**.
- **Submission**, **EvaluationResult** e **Progress** derivam diretamente do fluxo de prática, correção automática e acompanhamento de evolução.

## 3. Authorization Matrix

**Legenda:** ✅ Permitido | ❌ Negado | 🔒 Somente próprio | 👥 Somente turmas sob responsabilidade / escopo pedagógico relacionado

| Resource:Action | Administrador | Professor | Aluno |
|-----------------|---------------|-----------|-------|
| User:Create | ✅ | ❌ | ❌ |
| User:Read | ✅ | 👥 | 🔒 |
| User:Update | ✅ | ❌ | 🔒 |
| User:Delete | ✅ | ❌ | ❌ |
| StudentProfile:Create | ✅ | ❌ | ❌ |
| StudentProfile:Read | ✅ | 👥 | 🔒 |
| StudentProfile:Update | ✅ | ❌ | 🔒 |
| StudentProfile:Delete | ✅ | ❌ | ❌ |
| TeacherProfile:Create | ✅ | ❌ | ❌ |
| TeacherProfile:Read | ✅ | 🔒 | ❌ |
| TeacherProfile:Update | ✅ | 🔒 | ❌ |
| TeacherProfile:Delete | ✅ | ❌ | ❌ |
| AdminProfile:Create | ✅ | ❌ | ❌ |
| AdminProfile:Read | ✅ | ❌ | ❌ |
| AdminProfile:Update | ✅ | ❌ | ❌ |
| AdminProfile:Delete | ✅ | ❌ | ❌ |
| Class:Create | ✅ | ✅ | ❌ |
| Class:Read | ✅ | 👥 | ❌ |
| Class:Update | ✅ | 👥 | ❌ |
| Class:Delete | ✅ | ❌ | ❌ |
| ClassMembership:Create | ✅ | ✅ | ❌ |
| ClassMembership:Read | ✅ | 👥 | ❌ |
| ClassMembership:Update | ✅ | 👥 | ❌ |
| ClassMembership:Delete | ✅ | ✅ | ❌ |
| Module:Create | ✅ | ❌ | ❌ |
| Module:Read | ✅ | ✅ | ✅ |
| Module:Update | ✅ | ❌ | ❌ |
| Module:Delete | ✅ | ❌ | ❌ |
| Lesson:Create | ✅ | ❌ | ❌ |
| Lesson:Read | ✅ | ✅ | ✅ |
| Lesson:Update | ✅ | ❌ | ❌ |
| Lesson:Delete | ✅ | ❌ | ❌ |
| WrittenContent:Create | ✅ | ❌ | ❌ |
| WrittenContent:Read | ✅ | ✅ | ✅ |
| WrittenContent:Update | ✅ | ❌ | ❌ |
| WrittenContent:Delete | ✅ | ❌ | ❌ |
| Video:Create | ✅ | ❌ | ❌ |
| Video:Read | ✅ | ✅ | ✅ |
| Video:Update | ✅ | ❌ | ❌ |
| Video:Delete | ✅ | ❌ | ❌ |
| Exercise:Create | ✅ | ❌ | ❌ |
| Exercise:Read | ✅ | ✅ | ✅ |
| Exercise:Update | ✅ | ❌ | ❌ |
| Exercise:Delete | ✅ | ❌ | ❌ |
| CorrectionTest:Create | ✅ | ❌ | ❌ |
| CorrectionTest:Read | ✅ | ❌ | ❌ |
| CorrectionTest:Update | ✅ | ❌ | ❌ |
| CorrectionTest:Delete | ✅ | ❌ | ❌ |
| Submission:Create | ✅ | ❌ | ✅ |
| Submission:Read | ✅ | 👥 | 🔒 |
| Submission:Update | ✅ | ❌ | ❌ |
| Submission:Delete | ✅ | ❌ | ❌ |
| EvaluationResult:Create | ✅ | ❌ | ❌ |
| EvaluationResult:Read | ✅ | 👥 | 🔒 |
| EvaluationResult:Update | ✅ | ❌ | ❌ |
| EvaluationResult:Delete | ✅ | ❌ | ❌ |
| Progress:Create | ✅ | ❌ | ❌ |
| Progress:Read | ✅ | 👥 | 🔒 |
| Progress:Update | ✅ | ❌ | ❌ |
| Progress:Delete | ✅ | ❌ | ❌ |

## 4. Special Rules

### 4.1 Regras de segurança em nível de linha
- **Aluno**
  - só pode visualizar e atualizar seus **próprios** dados de conta permitidos pela aplicação;
  - só pode visualizar seu **próprio StudentProfile**;
  - só pode visualizar suas **próprias submissões**, **resultados de avaliação** e **progresso**;
  - não pode acessar dados de outros alunos, professores ou administradores.

- **Professor**
  - só pode visualizar dados de **alunos vinculados às suas turmas**;
  - só pode visualizar **submissões**, **resultados** e **progresso** de estudantes pertencentes às turmas sob sua responsabilidade;
  - só pode visualizar e atualizar seu **próprio TeacherProfile**;
  - não pode acessar dados administrativos globais nem estudantes fora do seu escopo pedagógico.

- **Administrador**
  - possui acesso global a todos os registros, sujeito apenas a controles técnicos adicionais e auditoria.

### 4.2 Regras condicionais
- O professor pode **criar, editar e organizar turmas**, mas o material disponível **não confirma explicitamente** se ele pode:
  - transferir alunos entre turmas de professores diferentes;
  - editar dados cadastrais completos do aluno;
  - criar contas de usuários.
  
  **Assunção adotada para o MVP:** professor pode gerir apenas a composição das próprias turmas, sem administrar contas.

- O aluno pode atualizar apenas informações do próprio contexto de conta que a aplicação expuser como autoatendimento.  
  **Gap:** os documentos não detalham quais campos do cadastro são autoeditáveis.

- **CorrectionTest** é restrito ao administrador porque os testes internos fazem parte da lógica de correção e sua exposição poderia comprometer a integridade pedagógica e técnica do exercício.

### 4.3 Regras temporais e de estado
- **Submissão** só pode ser criada por aluno autenticado durante o uso regular da plataforma e vinculada a um exercício existente.
- **EvaluationResult** deve ser gerado pelo fluxo interno de correção automática após a submissão; não é um recurso de criação manual por professor ou aluno.
- **Progress** deve refletir eventos do sistema, como consumo de aulas e resolução de exercícios, e não edição manual por aluno ou professor.
- Se a conta do usuário estiver com **account_status** incompatível com acesso ativo, permissões efetivas devem ser bloqueadas independentemente do papel.  
  Isso decorre da presença do atributo `account_status` no Domain Model.
- O acesso a conteúdos depende de autenticação para experiência completa de trilha e acompanhamento. Os documentos não confirmam publicação aberta de conteúdo sem login.

### 4.4 Regras de proteção de dados
- Como a plataforma lida com dados pessoais de estudantes e professores, o acesso deve seguir **princípio do menor privilégio**.
- Dados acadêmicos e pessoais não devem ser expostos fora do vínculo funcional do usuário.
- Ações administrativas relevantes, especialmente sobre usuários, turmas, conteúdo e exercícios, devem ter **trilha de auditoria**.  
  **Assunção recomendada**, suportada pelo risco e criticidade do domínio, embora a especificação da auditoria ainda não tenha sido detalhada.

### 4.5 Gaps e ambiguidades identificados
Os documentos de descoberta não definem explicitamente:
- se alunos podem se cadastrar sozinhos;
- se professores podem criar contas ou apenas organizar turmas;
- se existe distinção entre administrador técnico e administrador de conteúdo;
- quais campos de perfil podem ser editados por autoatendimento;
- se conteúdos introdutórios poderão ser parcialmente públicos sem login.

Esses pontos devem ser validados com o cliente antes da implementação final das policies.

## 5. Public vs Authenticated

### Recursos públicos (sem login)
Com base nos documentos disponíveis, **não há recursos explicitamente definidos como públicos** no MVP.

**Assunção operacional recomendada para a primeira versão:**
- páginas institucionais básicas, se existirem, podem ser públicas;
- o núcleo da plataforma educacional deve exigir autenticação.

Como os artefatos de descoberta não descrevem páginas institucionais, elas não entram na matriz principal.

### Recursos acessíveis apenas para usuários autenticados
- trilha de aprendizagem;
- módulos;
- aulas;
- videoaulas;
- materiais escritos;
- exercícios;
- editor de código;
- submissões;
- resultados de avaliação;
- progresso do aluno;
- painel do professor;
- gestão de turmas;
- administração de conteúdo;
- gestão de usuários.

## 6. Observações de Implementação

### Modelo recomendado
Os documentos suportam um modelo **RBAC com filtros contextuais de ABAC**, combinando:
- papel do usuário: **Administrador, Professor, Aluno**;
- vínculo do registro com o usuário autenticado;
- vínculo do aluno com turmas do professor;
- estado da conta (`account_status`).

### Regras centrais para implementação
- `role = Administrador` → acesso global aos recursos administrativos e operacionais.
- `role = Professor` + vínculo com turma → acesso pedagógico contextual a alunos, progresso, submissões e resultados.
- `role = Aluno` + `owner_id = current_user` → acesso apenas aos próprios dados acadêmicos.
- `account_status != ativo` → negar acesso autenticado, independentemente do papel.

### Diretriz de menor privilégio
A matriz foi construída para:
- permitir integralmente a jornada do aluno de estudar, praticar e acompanhar evolução;
- permitir a jornada do professor de acompanhar alunos e turmas;
- reservar ao administrador a manutenção estrutural do sistema e do conteúdo;
- evitar permissões excessivas para professor e aluno em áreas de gestão global.