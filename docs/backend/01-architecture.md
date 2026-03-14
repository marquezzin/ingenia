# Arquitetura do Backend

## Visão Geral

O backend segue uma arquitetura em camadas clara, onde cada camada tem uma responsabilidade única:

```
Request → View → UseCase (Service) → Selector/Model → Response
```

## Camadas

### 1. Models
- Definição de dados e relacionamentos no banco
- Sem lógica de negócio
- Arquivo: `<app>/models.py`

### 2. Selectors
- Queries read-only ao banco de dados
- Retornam querysets ou objetos
- Sem efeitos colaterais
- Arquivo: `<app>/selectors.py`

### 3. Services / UseCases
- **Toda a lógica de negócio fica aqui**
- Cada UseCase é uma classe com método `execute()`
- Recebe inputs tipados, retorna resultados tipados
- Lança exceções de `core.errors` para erros de negócio
- Arquivo: `<app>/services/<entidade>.py`

### 4. Serializers
- Validação e serialização de dados HTTP
- Sem lógica de negócio
- Arquivo: `<app>/serializers.py`

### 5. Views
- Extrai dados do request
- Chama o UseCase correspondente
- Trata exceções e retorna respostas HTTP
- Arquivo: `<app>/views.py`

## Estrutura de Apps

```
backend/src/
├── config/          # Configurações Django
├── core/            # Utilitários compartilhados
└── <app>/           # Um diretório por domínio de negócio
```

## Princípios

1. **Separação de responsabilidades** — cada camada faz uma coisa
2. **Testabilidade** — UseCases são testáveis sem HTTP
3. **Sem lógica nos models** — models são apenas dados
4. **Erros explícitos** — use `ApplicationError`, `NotFoundError`, etc.
