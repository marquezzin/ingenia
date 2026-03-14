# Journeys

# Plataforma de Ensino Introdutório de Programação — User Journeys

## Journey Overview

| ID | Journey | Persona | Priority |
|----|---------|---------|----------|
| J-001 | Fazer login e acessar a área correta conforme o perfil | Aluno, Professor, Administrador | Critical |
| J-002 | Aluno percorre a trilha de aprendizagem e acessa uma aula | Estudante do 8º e 9º ano iniciante em programação | Critical |
| J-003 | Aluno consome conteúdo da aula e resolve exercício com correção automática | Estudante do 8º e 9º ano iniciante em programação | Critical |
| J-004 | Aluno acompanha o próprio progresso na trilha | Estudante do 8º e 9º ano iniciante em programação | Critical |
| J-005 | Professor cria/organiza uma turma e acompanha desempenho coletivo | Professor do ensino fundamental | Critical |
| J-006 | Professor consulta progresso individual de um aluno | Professor do ensino fundamental | Critical |
| J-007 | Administrador cria e organiza um módulo com aula e exercício | Administrador da plataforma | Critical |
| J-008 | Administrador gerencia usuários da plataforma | Administrador da plataforma | Critical |

## Journey Details

### J-001: Fazer login e acessar a área correta conforme o perfil
**Persona:** Aluno, Professor, Administrador  
**Priority:** Critical

#### Preconditions
- O usuário possui uma conta `User` cadastrada.
- O `User.account_status` está ativo.
- O usuário conhece o e-mail e a senha corretos.
- O mecanismo de autenticação da plataforma está disponível.

#### Steps
1. O usuário acessa a tela de login da plataforma web em desktop.
2. O usuário preenche os campos **E-mail** e **Senha** e clica no botão **Entrar**.
3. O sistema valida as credenciais e identifica o `User.role`.
4. O sistema cria a sessão autenticada e redireciona o usuário para a área correta:
   - aluno: área da trilha de aprendizagem;
   - professor: painel do professor;
   - administrador: painel administrativo.

#### Expected Result
- O usuário entra com sucesso na plataforma.
- O usuário visualiza apenas a área compatível com seu perfil.
- O acesso fica restrito às permissões correspondentes ao papel autenticado.

#### Expected Errors

| Condition | Error | Recovery |
|-----------|-------|----------|
| E-mail não cadastrado | Exibir mensagem de falha de autenticação sem confirmar se o e-mail existe | Usuário revisa os dados informados e tenta novamente |
| Senha incorreta | Exibir mensagem de falha de autenticação | Usuário corrige a senha e envia novamente |
| Conta com `account_status` inativo/bloqueado | Impedir login e informar que a conta não está disponível para acesso | Usuário deve procurar o administrador da plataforma |
| Usuário autenticado tenta acessar URL de outra área por perfil | Bloquear acesso e redirecionar para a área autorizada ou exibir mensagem de acesso negado | Usuário retorna à área permitida para seu perfil |

#### Related Entities
- `User`

---

### J-002: Aluno percorre a trilha de aprendizagem e acessa uma aula
**Persona:** Estudante do 8º e 9º ano iniciante em programação  
**Priority:** Critical

#### Preconditions
- O usuário está autenticado como aluno.
- Existe um `StudentProfile` vinculado ao `User`.
- Há pelo menos um `Módulo` cadastrado com `Aula` publicada.
- A trilha de aprendizagem está disponível para navegação.

#### Steps
1. O aluno entra na **área da trilha de aprendizagem** após login.
2. O sistema exibe a trilha visual com os `Módulos` disponíveis e indicação do progresso atual.
3. O aluno clica em um módulo introdutório da trilha, como um módulo de conceitos básicos.
4. O sistema abre a visão do módulo e lista as `Aulas` associadas.
5. O aluno seleciona uma aula na lista.
6. O sistema abre a página da aula com a **videoaula**, o **material escrito** e os **exercícios** relacionados.

#### Expected Result
- O aluno consegue navegar pela trilha sem dificuldade.
- O aluno acessa a aula selecionada dentro do módulo correto.
- O sistema apresenta a estrutura esperada da aula: vídeo, conteúdo escrito e exercício(s).

#### Expected Errors

| Condition | Error | Recovery |
|-----------|-------|----------|
| Módulo sem aulas cadastradas | Exibir mensagem informando que o conteúdo ainda não está disponível | Aluno retorna à trilha e seleciona outro módulo disponível |
| Aula removida ou indisponível após aparecer na lista | Exibir mensagem de conteúdo indisponível | Aluno volta para a visão do módulo e escolhe outra aula |
| Usuário não autenticado tenta abrir a trilha | Redirecionar para a tela de login | Usuário realiza autenticação antes de continuar |
| Professor ou administrador tenta abrir a área exclusiva de aluno pela rota da trilha | Negar acesso por permissão | Usuário permanece em sua área autorizada |

#### Related Entities
- `User`
- `StudentProfile`
- `Módulo`
- `Aula`
- `Vídeo`
- `Conteúdo escrito`
- `Progresso`

**Assumption/GAP:** o documento de descoberta não define nomes reais de telas, estados de publicação de conteúdo nem regras exatas de desbloqueio entre módulos; a jornada assume navegação direta pela trilha visual do aluno.

---

### J-003: Aluno consome conteúdo da aula e resolve exercício com correção automática
**Persona:** Estudante do 8º e 9º ano iniciante em programação  
**Priority:** Critical

#### Preconditions
- O aluno está autenticado.
- Existe uma `Aula` acessível com `Vídeo`, `Conteúdo escrito` e ao menos um `Exercício`.
- O `Exercício` possui `Teste de correção` configurado.
- O editor de código e o ambiente controlado de execução estão disponíveis.

#### Steps
1. Na página da aula, o aluno assiste à **videoaula** e lê o **material escrito** com explicações e exemplos.
2. O aluno rola até a seção de **Exercícios** e seleciona um `Exercício`.
3. O sistema abre o `Exercício` com enunciado e o **editor de código** no navegador.
4. O aluno escreve sua solução no editor e clica no botão **Submeter**.
5. O sistema cria uma `Submissão`, executa o código em ambiente controlado e roda os `Testes de correção` predefinidos.
6. O sistema exibe o `Resultado de avaliação`, indicando sucesso ou falha, com feedback automático de apoio.
7. Se a submissão falhar, o aluno ajusta o código no editor e envia nova submissão.

#### Expected Result
- O aluno consegue resolver o exercício diretamente na plataforma.
- O sistema processa a submissão com segurança e retorna resultado automático.
- O aluno recebe feedback imediato para continuar aprendendo.
- O histórico de tentativa fica associado ao aluno e ao exercício.

#### Expected Errors

| Condition | Error | Recovery |
|-----------|-------|----------|
| Código enviado em branco | Exibir mensagem informando que é necessário inserir código antes de submeter | Aluno preenche o editor e tenta novamente |
| Falha nos testes internos | Exibir resultado de falha com mensagem de apoio, sem expor a resposta completa | Aluno revisa o código com base no feedback e envia nova submissão |
| Erro de execução no código submetido | Exibir mensagem de erro de execução em linguagem simples | Aluno corrige a lógica ou sintaxe e submete novamente |
| Tempo limite ou falha no ambiente de execução controlado | Exibir mensagem de indisponibilidade ou falha temporária na correção | Aluno aguarda e tenta nova submissão |
| Usuário sem papel de aluno tenta submeter exercício | Negar operação por permissão | Usuário retorna à área compatível com seu perfil |

#### Related Entities
- `User`
- `StudentProfile`
- `Aula`
- `Exercício`
- `Teste de correção`
- `Submissão`
- `Resultado de avaliação`
- `Progresso`

**Assumption/GAP:** a linguagem de programação da primeira versão ainda não foi definida. As mensagens exatas de compilação/execução dependem dessa decisão.

---

### J-004: Aluno acompanha o próprio progresso na trilha
**Persona:** Estudante do 8º e 9º ano iniciante em programação  
**Priority:** Critical

#### Preconditions
- O aluno está autenticado.
- Existe `Progresso` registrado para o aluno ou a trilha está pronta para exibir progresso inicial.
- Há `Módulos`, `Aulas` e `Exercícios` associados à trilha.

#### Steps
1. O aluno acessa sua **área de progresso** ou retorna à **trilha de aprendizagem**.
2. O sistema exibe os `Módulos` da trilha com status visual de andamento.
3. O aluno consulta quais módulos já iniciou, quais concluiu e quantos exercícios resolveu.
4. O aluno clica em um módulo específico para visualizar o detalhamento de aulas e continuidade da trilha.
5. O sistema apresenta o estado atual do avanço do aluno naquele trecho da jornada.

#### Expected Result
- O aluno entende claramente sua evolução na plataforma.
- O sistema mostra progresso por trilha/módulo de forma simples e guiada.
- O aluno identifica onde parou e qual é o próximo conteúdo a acessar.

#### Expected Errors

| Condition | Error | Recovery |
|-----------|-------|----------|
| Não há progresso registrado ainda | Exibir estado inicial informando que a trilha ainda não foi iniciada | Aluno acessa o primeiro módulo disponível |
| Dados de progresso temporariamente indisponíveis | Exibir mensagem de erro ao carregar progresso | Aluno atualiza a página ou tenta novamente mais tarde |
| Aluno tenta abrir detalhe de módulo inexistente | Exibir mensagem de conteúdo não encontrado | Aluno retorna à visão geral da trilha |
| Usuário não autenticado tenta acessar área de progresso | Redirecionar para login | Usuário autentica e retorna à jornada |

#### Related Entities
- `User`
- `StudentProfile`
- `Progresso`
- `Módulo`
- `Aula`
- `Exercício`

**Assumption/GAP:** o cálculo detalhado de conclusão por aula e por módulo ainda não foi formalizado no modelo de domínio; a jornada usa os indicadores explicitamente citados na descoberta.

---

### J-005: Professor cria/organiza uma turma e acompanha desempenho coletivo
**Persona:** Professor do ensino fundamental  
**Priority:** Critical

#### Preconditions
- O usuário está autenticado como professor.
- Existe um `TeacherProfile` vinculado ao usuário.
- Há alunos cadastrados na plataforma.
- O módulo de `Turma` está disponível para o perfil professor.

#### Steps
1. O professor acessa o **painel do professor**.
2. O professor navega até a seção **Turmas**.
3. O professor cria uma nova `Turma` ou abre uma turma existente para organização.
4. O professor associa alunos à turma, conforme as opções disponíveis na interface.
5. O sistema salva a configuração da turma.
6. O professor abre a visão de desempenho coletivo da turma.
7. O sistema exibe, para os alunos da turma, indicadores como:
   - quem iniciou a trilha;
   - módulos concluídos;
   - quantidade de exercícios resolvidos.

#### Expected Result
- O professor consegue organizar os alunos em uma turma.
- O professor visualiza o acompanhamento coletivo em um painel centralizado.
- O sistema apresenta informações suficientes para intervenção pedagógica inicial no MVP.

#### Expected Errors

| Condition | Error | Recovery |
|-----------|-------|----------|
| Tentativa de salvar turma sem identificação mínima exigida | Exibir erro de validação no formulário de turma | Professor preenche os campos obrigatórios e salva novamente |
| Aluno já associado à mesma turma | Exibir mensagem informando que o aluno já faz parte da turma | Professor evita duplicidade e segue com os demais alunos |
| Professor tenta visualizar turma que não pertence ao seu contexto de acesso | Negar acesso por autorização | Professor retorna à lista de turmas permitidas |
| Falha ao carregar métricas da turma | Exibir mensagem de erro no painel coletivo | Professor atualiza a página ou tenta novamente mais tarde |

#### Related Entities
- `User`
- `TeacherProfile`
- `Turma`
- `StudentProfile`
- `Progresso`

**Assumption/GAP:** a descoberta não definiu se a gestão de turmas terá cadastro manual individual, importação em lote ou ambos. Esta jornada assume associação manual básica compatível com o MVP.

---

### J-006: Professor consulta progresso individual de um aluno
**Persona:** Professor do ensino fundamental  
**Priority:** Critical

#### Preconditions
- O professor está autenticado.
- O professor possui acesso a pelo menos uma `Turma`.
- Existe ao menos um aluno vinculado à turma.
- Há dados de `Progresso` disponíveis para consulta.

#### Steps
1. O professor acessa o **painel do professor**.
2. O professor seleciona uma `Turma` na lista.
3. O sistema exibe os alunos vinculados e um resumo de acompanhamento.
4. O professor clica no nome de um aluno.
5. O sistema abre a visão individual do aluno com indicadores como:
   - início da trilha;
   - módulos concluídos;
   - quantidade de exercícios resolvidos.
6. O professor utiliza essas informações para identificar necessidade de apoio pedagógico.

#### Expected Result
- O professor consegue consultar o progresso individual de um aluno de forma centralizada.
- O sistema apresenta os indicadores previstos no escopo do MVP.
- O professor consegue diferenciar alunos que já começaram, avançaram ou estão com pouca atividade.

#### Expected Errors

| Condition | Error | Recovery |
|-----------|-------|----------|
| Aluno sem progresso registrado | Exibir estado informando que o aluno ainda não iniciou a trilha | Professor orienta o aluno a acessar o primeiro módulo |
| Professor tenta acessar dados de aluno fora de sua turma/contexto permitido | Negar acesso aos dados do aluno | Professor retorna à turma autorizada |
| Registro do aluno não encontrado | Exibir mensagem de aluno não encontrado | Professor volta à lista da turma e seleciona outro aluno |
| Painel individual indisponível momentaneamente | Exibir erro de carregamento | Professor tenta novamente mais tarde |

#### Related Entities
- `User`
- `TeacherProfile`
- `Turma`
- `StudentProfile`
- `Progresso`
- `Módulo`

---

### J-007: Administrador cria e organiza um módulo com aula e exercício
**Persona:** Administrador da plataforma  
**Priority:** Critical

#### Preconditions
- O usuário está autenticado como administrador.
- Existe um `User` com papel de administrador ativo.
- O painel administrativo está disponível.
- Não há restrição de permissão para gestão de conteúdo no perfil autenticado.

#### Steps
1. O administrador acessa o **painel administrativo**.
2. O administrador entra na seção **Módulos** e clica em **Criar módulo**.
3. O administrador cadastra um novo `Módulo` introdutório da trilha.
4. O sistema salva o módulo e o exibe na organização de conteúdo.
5. O administrador acessa o módulo recém-criado e clica em **Adicionar aula**.
6. O administrador cadastra uma `Aula` com **videoaula** e **material escrito**.
7. O administrador acessa a seção de **Exercícios** da aula e cria um `Exercício`.
8. O administrador associa `Testes de correção` ao exercício para permitir avaliação automática.
9. O sistema salva a estrutura de conteúdo e a deixa disponível para uso conforme a configuração administrativa.

#### Expected Result
- O administrador consegue estruturar a trilha com módulo, aula e exercício.
- O conteúdo fica organizado de forma coerente com o fluxo pedagógico do produto.
- O exercício fica preparado para correção automática.

#### Expected Errors

| Condition | Error | Recovery |
|-----------|-------|----------|
| Campo obrigatório do módulo, aula ou exercício não preenchido | Exibir erro de validação destacando os campos obrigatórios | Administrador corrige os dados e salva novamente |
| Tentativa de criar exercício sem testes de correção associados | Impedir publicação operacional do exercício ou alertar que a correção automática ficará incompleta | Administrador adiciona os testes necessários antes de disponibilizar o exercício |
| Usuário não administrador tenta acessar a gestão de conteúdo | Negar acesso por permissão | Usuário retorna à área permitida |
| Falha ao salvar conteúdo por indisponibilidade do sistema | Exibir mensagem de erro ao salvar | Administrador revisa se houve persistência parcial e tenta novamente |

#### Related Entities
- `User`
- `Módulo`
- `Aula`
- `Vídeo`
- `Conteúdo escrito`
- `Exercício`
- `Teste de correção`

**Assumption/GAP:** o transcript não define estados formais como rascunho/publicado nem ordem obrigatória de preenchimento do cadastro. A jornada assume um fluxo administrativo direto de criação e organização.

---

### J-008: Administrador gerencia usuários da plataforma
**Persona:** Administrador da plataforma  
**Priority:** Critical

#### Preconditions
- O administrador está autenticado.
- O painel administrativo está disponível.
- Existe funcionalidade de gestão de `User`.

#### Steps
1. O administrador acessa o **painel administrativo**.
2. O administrador entra na seção **Usuários**.
3. O sistema exibe a listagem de usuários cadastrados com seus papéis e estados de conta.
4. O administrador clica em **Cadastrar usuário** ou seleciona um usuário existente para edição.
5. O administrador informa ou atualiza dados como nome, e-mail, perfil e estado da conta.
6. O sistema valida as informações e salva o registro.
7. O administrador retorna à listagem e confirma a atualização refletida na tela.

#### Expected Result
- O administrador consegue criar e manter usuários da plataforma.
- O sistema preserva a separação entre os papéis aluno, professor e administrador.
- O estado da conta passa a refletir a regra de acesso no login.

#### Expected Errors

| Condition | Error | Recovery |
|-----------|-------|----------|
| E-mail já cadastrado para outro `User` | Exibir erro informando duplicidade de e-mail | Administrador corrige o e-mail ou edita o usuário existente |
| Campos obrigatórios ausentes no cadastro | Exibir mensagens de validação nos campos | Administrador preenche os dados faltantes |
| Definição de papel inválido ou não suportado | Exibir erro de validação para o campo de perfil | Administrador seleciona um dos perfis permitidos |
| Usuário sem permissão tenta acessar a gestão de usuários | Negar acesso | Usuário retorna à área autorizada |

#### Related Entities
- `User`
- `StudentProfile`
- `TeacherProfile`

**Assumption/GAP:** o documento de descoberta não detalha se a criação de usuário já cria automaticamente `StudentProfile`/`TeacherProfile` ou se isso ocorre em etapa separada; a implementação deverá esclarecer essa regra.

## Edge Cases

- Aluno faz múltiplas submissões do mesmo `Exercício` em sequência muito rápida; o sistema deve evitar inconsistência entre `Submissão`, `Resultado de avaliação` e `Progresso`.
- Duas submissões do mesmo aluno para o mesmo exercício retornam em ordem diferente por latência do ambiente de execução; deve ficar claro qual resultado pertence a qual tentativa.
- O ambiente controlado de execução fica temporariamente indisponível no momento do clique em **Submeter**; a interface deve evitar que o aluno pense que passou ou falhou sem avaliação concluída.
- Um `Módulo` é editado pelo administrador enquanto um aluno está com a aula aberta; deve haver comportamento previsível para conteúdo removido ou atualizado durante a navegação.
- Um `Exercício` tem testes mal configurados e marca como falha uma solução válida; isso é um risco operacional relevante, embora a regra de revisão pedagógica/técnica não tenha sido detalhada na descoberta.
- Professor tenta acompanhar uma turma sem alunos vinculados; o painel deve mostrar estado vazio claro, sem parecer erro de sistema.
- Aluno em uso individual em casa pode não estar vinculado a uma `Turma`; a experiência do aluno deve continuar funcionando sem dependência do contexto escolar.
- Um usuário com sessão autenticada tenta acessar manualmente URLs de outro perfil; o sistema deve aplicar autorização também no backend, não apenas na navegação.
- A trilha ainda não foi iniciada por nenhum aluno; o painel do professor deve diferenciar “sem atividade” de “erro ao carregar dados”.
- Contas com `account_status` inativo não devem conseguir autenticar, mesmo com credenciais corretas.
- A plataforma é focada em desktop, mas pode ser aberta em tela menor; como a responsividade mínima não foi definida, isso permanece como gap de UX e teste.
- Como a linguagem de programação da primeira versão ainda não foi definida, devem ser testados cenários de mensagem de erro, editor e execução somente após essa decisão.
- Não há definição formal sobre consentimento, retenção e regras adicionais para dados de menores; qualquer fluxo que dependa dessas exigências permanece como lacuna regulatória a validar com o cliente.