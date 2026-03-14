# Assumptions

# Plataforma de Ensino Introdutório de Programação — Assumptions & Risks

## 1. Assumptions

| # | Assumption | Impact if Wrong | Validated? |
|---|-----------|-----------------|------------|
| A1 | A plataforma será usada por estudantes do 8º e 9º ano do ensino fundamental, em escolas públicas, privadas e também em uso individual em casa. | Se o público real tiver perfil diferente, o conteúdo, a linguagem e a experiência de uso podem não atender adequadamente os usuários. | Yes |
| A2 | Os alunos não terão experiência prévia com programação, portanto a trilha de aprendizagem deve partir do nível introdutório absoluto. | Se parte relevante dos alunos já tiver conhecimento prévio, o conteúdo pode parecer básico demais e reduzir engajamento. | Yes |
| A3 | A linguagem da plataforma, das aulas e dos feedbacks deve ser simples, guiada e apropriada para a faixa etária atendida. | Se a linguagem for técnica ou complexa demais, os alunos podem ter dificuldade de compreensão e abandono precoce. | Yes |
| A4 | O acesso principal na primeira versão será por desktop, tanto em ambiente escolar quanto em casa. | Se o uso real ocorrer majoritariamente por celular ou tablet, a experiência poderá ficar inadequada e reduzir adoção. | Yes |
| A5 | A plataforma terá três perfis principais de usuário: aluno, professor e administrador, com permissões distintas. | Se surgirem outros perfis ou necessidades de permissão mais complexas, a modelagem de acesso poderá precisar de revisão estrutural. | Yes |
| A6 | O fluxo pedagógico principal seguirá a sequência videoaula → material escrito → exercício prático com correção automática. | Se a prática pedagógica exigir outra sequência ou formatos adicionais, será necessário redesenhar a navegação e a organização dos módulos. | Yes |
| A7 | Cada exercício poderá ser avaliado automaticamente por meio da execução do código do aluno em ambiente controlado com testes previamente definidos. | Se a correção automática não for tecnicamente confiável ou segura, o principal diferencial da plataforma ficará comprometido. | Yes |
| A8 | O ambiente de execução de código conseguirá isolar a execução das submissões dos alunos com segurança suficiente para uso educacional. | Se o isolamento falhar, pode haver riscos de segurança, indisponibilidade da plataforma ou exposição de dados. | No |
| A9 | Os feedbacks automáticos dos exercícios poderão indicar falhas de forma útil sem expor respostas completas ao aluno. | Se o feedback for insuficiente, o aluno pode não aprender com o erro; se for detalhado demais, pode incentivar tentativa e erro sem compreensão. | No |
| A10 | Professores precisarão acompanhar progresso por aluno e por turma, incluindo início da trilha, módulos concluídos e quantidade de exercícios resolvidos. | Se esses indicadores não forem suficientes para acompanhamento pedagógico, o painel do professor poderá não atender ao uso real. | Yes |
| A11 | O recurso de gestão de turmas será suficiente para organizar estudantes em grupos e acompanhar desempenho coletivo sem integração com sistemas escolares externos. | Se as escolas exigirem sincronização com sistemas institucionais, o cadastro manual poderá gerar retrabalho e baixa adesão. | No |
| A12 | O administrador terá capacidade de cadastrar e organizar módulos, aulas, exercícios e usuários sem depender de suporte técnico. | Se a operação administrativa for complexa demais, a manutenção do conteúdo ficará lenta e sujeita a erros. | Yes |
| A13 | A primeira versão não incluirá gamificação avançada, chat em tempo real, integração com sistemas escolares, app mobile nativo, certificação, aulas ao vivo nem suporte a várias linguagens de programação. | Se esses recursos forem considerados essenciais pelos usuários logo no início, pode haver frustração e pressão por expansão prematura de escopo. | Yes |
| A14 | A primeira versão trabalhará com uma única linguagem de programação, embora a linguagem específica ainda não tenha sido definida na entrevista. | Se a linguagem escolhida não for adequada ao nível dos alunos ou ao mecanismo de correção automática, pode haver impacto pedagógico e técnico relevante. | No |
| A15 | A plataforma lidará com dados pessoais de estudantes e professores e deverá contar com autenticação, controle de permissões e proteção contra vulnerabilidades comuns em aplicações web. | Se os controles de segurança forem insuficientes, haverá risco de acesso indevido, incidentes com dados e perda de confiança. | Yes |
| A16 | A visualização da trilha de aprendizagem e do progresso do aluno é um elemento importante para motivação e continuidade no estudo. | Se essa visualização não gerar valor percebido, parte do esforço de UX pode não trazer impacto no engajamento esperado. | No |
| A17 | O uso em casa pressupõe que o aluno terá acesso a computador e conexão de internet suficientes para assistir videoaulas, ler materiais e submeter código. | Se muitos alunos não tiverem essa infraestrutura, a adoção fora da escola ficará limitada. | No |
| A18 | Não há indicação, na entrevista, de exigências formais adicionais de acessibilidade, conformidade regulatória específica além de proteção de dados, ou suporte offline. | Se essas exigências surgirem depois, poderá haver replanejamento de arquitetura, design e cronograma. | No |

## 2. Risks

| # | Risk | Probability | Impact | Mitigation |
|---|------|------------|--------|------------|
| R1 | O mecanismo de execução e correção automática de código não atingir nível adequado de segurança para operar submissões de alunos. | High | High | Adotar sandboxing, limites de tempo e memória, isolamento por processo ou contêiner e testes de segurança antes da liberação. |
| R2 | A linguagem de programação da primeira versão não ter sido definida pode atrasar decisões de conteúdo, editor e motor de correção. | High | High | Definir a linguagem prioritária logo no início com base em facilidade para iniciantes e viabilidade técnica de correção automática. |
| R3 | O foco em desktop não refletir o comportamento real de uso, especialmente no contexto doméstico. | Medium | High | Validar cedo o perfil de acesso dos usuários e garantir ao menos responsividade básica para telas menores, mesmo sem app nativo. |
| R4 | O feedback automático dos exercícios ser genérico demais e não apoiar o aprendizado por tentativa e erro. | Medium | High | Projetar mensagens de erro pedagógicas, revisar testes por exercício e validar com professores antes da publicação em escala. |
| R5 | O cadastro e a gestão manual de turmas e usuários serem insuficientes para escolas com operação maior, já que integrações estão fora do escopo. | Medium | Medium | Criar fluxos administrativos simples para importação básica e operações em lote, mesmo sem integração externa completa. |
| R6 | Alunos sem experiência prévia acharem a progressão rápida demais ou a interface pouco guiada. | Medium | High | Aplicar progressão gradual, linguagem simples, exemplos claros e validação com usuários representativos da faixa etária. |
| R7 | A ausência de funcionalidades fora do escopo, como gamificação avançada ou múltiplas linguagens, gerar expectativa frustrada em parte dos usuários. | Medium | Medium | Comunicar claramente o escopo da primeira versão e priorizar bem a proposta central de aprendizagem estruturada com prática e feedback imediato. |
| R8 | O tratamento de dados pessoais de menores exigir cuidados adicionais não detalhados na entrevista. | Medium | High | Mapear dados coletados, revisar requisitos legais com o cliente e aplicar minimização de dados, controle de acesso e trilhas de auditoria. |
| R9 | O uso em casa ser prejudicado por limitações de infraestrutura dos alunos, como internet instável ou ausência de computador. | Medium | Medium | Otimizar páginas e materiais, reduzir dependência de recursos pesados quando possível e validar a realidade de acesso com o cliente. |
| R10 | O painel do professor não oferecer indicadores suficientes para intervenção pedagógica efetiva. | Medium | Medium | Prototipar o painel com foco em casos reais de acompanhamento e validar com docentes antes de consolidar o escopo final. |

## 3. Open Questions

| Question | Owner | Status | Resolution |
|---|---|---|---|
| Qual será a linguagem de programação suportada na primeira versão da plataforma? | Cliente / Responsável pedagógico | Aberta | To be defined with the client |
| Quais critérios pedagógicos definirão a ordem e a profundidade dos módulos introdutórios, como variáveis, condicionais, loops e funções? | Cliente / Responsável pedagógico | Aberta | To be defined with the client |
| Como será estruturado o formato exato dos feedbacks automáticos para equilibrar orientação ao aluno e prevenção de exposição da resposta? | Produto / Pedagógico | Aberta | To be defined with the client |
| Quais dados pessoais de alunos e professores serão efetivamente coletados no cadastro e no uso da plataforma? | Cliente / Produto | Aberta | To be defined with the client |
| Haverá necessidade de consentimento específico, fluxos de autorização ou políticas adicionais por se tratar de dados de estudantes do ensino fundamental? | Cliente / Jurídico | Aberta | To be defined with the client |
| O painel do professor precisará mostrar apenas progresso e conclusão ou também métricas adicionais, como tempo de atividade, taxa de erro e exercícios pendentes? | Cliente / Professores | Aberta | To be defined with the client |
| A gestão de turmas permitirá cadastro manual individual, importação em lote ou ambos? | Cliente / Operação escolar | Aberta | To be defined with the client |
| Os alunos poderão se cadastrar sozinhos para uso individual em casa ou sempre dependerão de vínculo com professor ou escola? | Cliente / Produto | Aberta | To be defined with the client |
| Haverá diferenciação de trilha, conteúdo ou relatórios entre uso escolar e uso individual em casa? | Cliente / Produto | Aberta | To be defined with the client |
| A plataforma deverá oferecer apenas experiência web para desktop ou também responsividade mínima para uso ocasional em dispositivos móveis? | Cliente / Produto | Aberta | To be defined with the client |
| Quais são os requisitos mínimos de infraestrutura para hospedar com segurança o ambiente de execução de código? | Time técnico | Aberta | To be defined with the client |
| Será necessário disponibilizar videoaulas hospedadas na própria plataforma ou incorporadas de serviço externo? | Cliente / Time técnico | Aberta | To be defined with the client |

## 4. Constraints

- **Restrições técnicas**
  - A plataforma precisa incluir um mecanismo de execução de código em ambiente controlado para correção automática.
  - O sistema deve operar com autenticação, controle de permissões e proteção contra vulnerabilidades comuns em aplicações web.
  - A primeira versão está orientada ao acesso por desktop.
  - O projeto não deve incluir suporte a várias linguagens de programação na primeira versão.
  - O projeto não deve incluir app mobile nativo na primeira versão.

- **Restrições de negócio e produto**
  - O público-alvo é composto por estudantes do 8º e 9º ano, incluindo alunos sem experiência prévia com programação.
  - A comunicação da plataforma deve usar linguagem simples e guiada, adequada ao público jovem.
  - A solução deve atender escolas públicas, escolas privadas e também uso individual em casa.
  - O sistema precisa contemplar três perfis principais: aluno, professor e administrador.
  - O administrador deve conseguir manter módulos, aulas, exercícios e usuários.
  - O professor deve conseguir acompanhar progresso de alunos e turmas.

- **Restrições de escopo**
  - Estão fora do escopo da primeira versão: gamificação avançada, chat em tempo real, integração com sistemas escolares, certificação, aulas ao vivo e suporte a várias linguagens de programação.
  - Como não houve confirmação do cliente sobre recursos sociais, não é possível assumir a inclusão de fórum, comentários entre alunos ou mensagens privadas.

- **Restrições regulatórias e de dados**
  - Como a plataforma lida com dados pessoais de estudantes e professores, a segurança dos dados é requisito obrigatório.
  - A entrevista não detalhou regras legais específicas, políticas de retenção, consentimento ou governança de dados, o que permanece como restrição em aberto até definição com o cliente.