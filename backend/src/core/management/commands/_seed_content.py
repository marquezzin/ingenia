"""Conteúdo Markdown das aulas — Trilha Python para Iniciantes."""

# ══════════════════════════════════════════════════════════════════════
# Módulo 1 — Introdução ao Python
# ══════════════════════════════════════════════════════════════════════

_MD_INTRO_1 = """\
# O que é Python?

**Python** é uma das linguagens de programação mais populares do mundo.
Criada por **Guido van Rossum** em 1991, ela é conhecida por sua
**sintaxe simples e legível**, que a torna ideal para quem está
começando a programar.

---

## Por que aprender Python?

- 🚀 **Fácil de aprender** — sintaxe limpa e intuitiva
- 📊 **Versátil** — usada em web, ciência de dados, IA, automação e mais
- 🌍 **Grande comunidade** — milhares de bibliotecas e tutoriais disponíveis
- 💼 **Mercado de trabalho** — alta demanda por profissionais Python

## Seu primeiro código

O programa mais clássico em qualquer linguagem é o **"Olá, Mundo!"**:

```python
print("Olá, Mundo!")
```

A função `print()` exibe texto na tela. Simples assim! 🎉

## Comentários

Use `#` para adicionar comentários ao seu código:

```python
# Isto é um comentário
print("Python é incrível!")  # Comentário na mesma linha
```

> 💡 **Dica:** Comentários são ignorados pelo Python e servem para
> documentar seu código.

## Recebendo dados do usuário

Para ler informações digitadas pelo usuário, use a função `input()`:

```python
nome = input("Qual é o seu nome? ")
print(f"Olá, {nome}!")
```

---

## Resumo

| Conceito | Exemplo |
|----------|---------|
| Imprimir na tela | `print("texto")` |
| Comentário | `# comentário` |
| Ler entrada | `input("prompt")` |
| f-string | `f"Olá, {variavel}!"` |
"""

_MD_INTRO_2 = """\
# Instalação e Ambiente

Antes de começar a programar, precisamos garantir que o Python
está instalado e configurado corretamente no seu computador.

---

## Instalando o Python

### Windows
1. Acesse [python.org](https://python.org/downloads/)
2. Baixe o instalador mais recente
3. **Marque a opção "Add Python to PATH"** ✅
4. Clique em *Install Now*

### macOS
```bash
brew install python
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install python3 python3-pip
```

## Verificando a instalação

Abra o terminal e digite:

```bash
python --version
# ou
python3 --version
```

Você deve ver algo como: `Python 3.14.0`

## O interpretador interativo

Digite `python` no terminal para abrir o **REPL** (Read-Eval-Print Loop):

```python
>>> 2 + 3
5
>>> print("Funciona!")
Funciona!
>>> exit()
```

## Seu primeiro script

Crie um arquivo chamado `meu_programa.py`:

```python
# meu_programa.py
nome = input("Seu nome: ")
idade = int(input("Sua idade: "))
print(f"{nome} tem {idade} anos!")
```

Execute com:
```bash
python meu_programa.py
```

> 💡 **Dica:** Sempre salve seus arquivos com a extensão `.py`.

---

## Resumo

| Ação | Comando |
|------|---------|
| Ver versão | `python --version` |
| Abrir REPL | `python` |
| Executar script | `python arquivo.py` |
| Sair do REPL | `exit()` |
"""

# ══════════════════════════════════════════════════════════════════════
# Módulo 2 — Variáveis e Tipos de Dados
# ══════════════════════════════════════════════════════════════════════

_MD_VARS_1 = """\
# Variáveis e Atribuição

**Variáveis** são como "caixas" que guardam valores na memória do
computador. Em Python, você cria uma variável simplesmente atribuindo
um valor a ela.

---

## Criando variáveis

```python
nome = "Maria"
idade = 25
altura = 1.68
estudante = True
```

> ⚠️ **Importante:** Em Python, você **não precisa declarar o tipo**
> da variável — ele é inferido automaticamente.

## Regras de nomenclatura

| ✅ Válido | ❌ Inválido | Motivo |
|-----------|-------------|--------|
| `nome` | `2nome` | Não pode começar com número |
| `minha_var` | `minha-var` | Hífen não é permitido |
| `_privado` | `class` | Palavras reservadas |
| `camelCase` | `minha var` | Espaços não são permitidos |

## Atribuição múltipla

```python
# Atribuição simultânea
x, y, z = 1, 2, 3

# Mesmo valor para várias variáveis
a = b = c = 0
```

## Troca de variáveis

Em Python, trocar valores entre variáveis é muito simples:

```python
a = 10
b = 20
a, b = b, a  # Agora a=20 e b=10
```

## A função `type()`

Use `type()` para descobrir o tipo de uma variável:

```python
>>> type(42)
<class 'int'>
>>> type(3.14)
<class 'float'>
>>> type("olá")
<class 'str'>
>>> type(True)
<class 'bool'>
```

---

## Resumo

| Conceito | Exemplo |
|----------|---------|
| Criar variável | `x = 10` |
| Múltipla | `a, b = 1, 2` |
| Trocar valores | `a, b = b, a` |
| Ver tipo | `type(x)` |
"""

_MD_VARS_2 = """\
# Tipos Numéricos e Operações

Python possui dois tipos numéricos principais: **inteiros** (`int`)
e **números de ponto flutuante** (`float`).

---

## Inteiros e Floats

```python
inteiro = 42        # int
decimal = 3.14      # float
negativo = -7       # int
cientifico = 2.5e3  # float → 2500.0
```

## Operadores aritméticos

| Operador | Operação | Exemplo | Resultado |
|----------|----------|---------|-----------|
| `+` | Soma | `5 + 3` | `8` |
| `-` | Subtração | `10 - 4` | `6` |
| `*` | Multiplicação | `3 * 7` | `21` |
| `/` | Divisão | `10 / 3` | `3.333...` |
| `//` | Divisão inteira | `10 // 3` | `3` |
| `%` | Resto (módulo) | `10 % 3` | `1` |
| `**` | Potência | `2 ** 3` | `8` |

## Conversão de tipos

```python
# String para inteiro
numero = int("42")     # 42

# String para float
preco = float("19.90") # 19.9

# Número para string
texto = str(100)       # "100"
```

## Funções matemáticas úteis

```python
abs(-5)      # 5 (valor absoluto)
round(3.7)   # 4 (arredondamento)
max(1, 5, 3) # 5 (maior valor)
min(1, 5, 3) # 1 (menor valor)
```

> 💡 **Dica:** Para funções mais avançadas, importe o módulo `math`:
> ```python
> import math
> math.sqrt(16)  # 4.0 (raiz quadrada)
> math.pi        # 3.14159...
> ```

---

## Resumo

| Operação | Símbolo | Exemplo |
|----------|---------|---------|
| Divisão inteira | `//` | `10 // 3` → `3` |
| Resto | `%` | `10 % 3` → `1` |
| Potência | `**` | `2 ** 3` → `8` |
| Converter | `int()`, `float()`, `str()` | |
"""

_MD_VARS_3 = """\
# Strings e Formatação

**Strings** são sequências de caracteres usadas para representar texto.
Elas são um dos tipos mais utilizados em Python.

---

## Criando strings

```python
aspas_simples = 'Olá'
aspas_duplas = "Mundo"
multilinha = \"\"\"Este texto
ocupa várias linhas\"\"\"
```

## Operações com strings

```python
# Concatenação
saudacao = "Olá" + " " + "Mundo"  # "Olá Mundo"

# Repetição
linha = "-" * 20  # "--------------------"

# Tamanho
len("Python")  # 6
```

## Indexação e fatiamento

```python
texto = "Python"
texto[0]     # "P" (primeiro caractere)
texto[-1]    # "n" (último caractere)
texto[0:3]   # "Pyt" (do índice 0 ao 2)
texto[2:]    # "thon" (do índice 2 ao final)
texto[::-1]  # "nohtyP" (invertido)
```

## Métodos úteis

```python
"python".upper()         # "PYTHON"
"PYTHON".lower()         # "python"
"olá mundo".title()      # "Olá Mundo"
"  espaços  ".strip()    # "espaços"
"a,b,c".split(",")       # ["a", "b", "c"]
" ".join(["a", "b"])     # "a b"
"Python".startswith("Py") # True
"Python".replace("P", "J") # "Jython"
```

## f-strings (formatação)

A maneira mais moderna de formatar strings em Python:

```python
nome = "Maria"
idade = 25
print(f"Meu nome é {nome} e tenho {idade} anos.")
# Meu nome é Maria e tenho 25 anos.

preco = 49.9
print(f"Preço: R$ {preco:.2f}")
# Preço: R$ 49.90
```

---

## Resumo

| Operação | Exemplo | Resultado |
|----------|---------|-----------|
| Concatenar | `"a" + "b"` | `"ab"` |
| Tamanho | `len("abc")` | `3` |
| Maiúsculas | `"abc".upper()` | `"ABC"` |
| Dividir | `"a,b".split(",")` | `["a", "b"]` |
| f-string | `f"{var}"` | valor de var |
"""

# ══════════════════════════════════════════════════════════════════════
# Módulo 3 — Estruturas Condicionais
# ══════════════════════════════════════════════════════════════════════

_MD_COND_1 = """\
# if, elif e else

As **estruturas condicionais** permitem que seu programa tome
decisões com base em condições. É como uma bifurcação no caminho:
dependendo da condição, o programa segue por um lado ou outro.

---

## Estrutura básica

```python
idade = 18

if idade >= 18:
    print("Maior de idade")
else:
    print("Menor de idade")
```

> ⚠️ **Atenção à indentação!** Python usa a indentação (4 espaços)
> para definir blocos de código, não chaves `{}`.

## Múltiplas condições com elif

```python
nota = 7.5

if nota >= 9:
    conceito = "A"
elif nota >= 7:
    conceito = "B"
elif nota >= 5:
    conceito = "C"
else:
    conceito = "D"

print(f"Conceito: {conceito}")
```

## Condicionais aninhados

```python
idade = 15
tem_autorizacao = True

if idade >= 18:
    print("Pode entrar")
else:
    if tem_autorizacao:
        print("Pode entrar com responsável")
    else:
        print("Não pode entrar")
```

## Operador ternário

Para condições simples, use o operador ternário:

```python
idade = 20
status = "maior" if idade >= 18 else "menor"
print(status)  # "maior"
```

---

## Resumo

| Estrutura | Uso |
|-----------|-----|
| `if` | Condição principal |
| `elif` | Condição alternativa |
| `else` | Quando nenhuma condição é verdadeira |
| Ternário | `valor_se_true if cond else valor_se_false` |
"""

_MD_COND_2 = """\
# Operadores de Comparação e Lógicos

Para criar condições, precisamos de **operadores de comparação**
(que comparam valores) e **operadores lógicos** (que combinam condições).

---

## Operadores de comparação

| Operador | Significado | Exemplo | Resultado |
|----------|-------------|---------|-----------|
| `==` | Igual a | `5 == 5` | `True` |
| `!=` | Diferente de | `5 != 3` | `True` |
| `>` | Maior que | `5 > 3` | `True` |
| `<` | Menor que | `5 < 3` | `False` |
| `>=` | Maior ou igual | `5 >= 5` | `True` |
| `<=` | Menor ou igual | `3 <= 5` | `True` |

## Operadores lógicos

| Operador | Significado | Exemplo | Resultado |
|----------|-------------|---------|-----------|
| `and` | E (ambos verdadeiros) | `True and False` | `False` |
| `or` | OU (ao menos um verdadeiro) | `True or False` | `True` |
| `not` | NÃO (inverte) | `not True` | `False` |

## Combinando condições

```python
idade = 25
renda = 3000

if idade >= 18 and renda >= 2000:
    print("Crédito aprovado!")

# Verificando pertencimento
fruta = "maçã"
if fruta in ["maçã", "banana", "uva"]:
    print("Fruta disponível!")
```

## O operador `in`

```python
# Em listas
5 in [1, 2, 3, 4, 5]    # True

# Em strings
"py" in "python"          # True

# Negação
"x" not in "python"       # True
```

## Valores truthy e falsy

Em Python, alguns valores são considerados **falsos**:

```python
# Todos estes são "falsy" (avaliados como False):
bool(0)      # False
bool("")     # False
bool([])     # False
bool(None)   # False

# Todo o resto é "truthy":
bool(1)      # True
bool("oi")   # True
bool([1,2])  # True
```

---

## Resumo

| Tipo | Operadores |
|------|------------|
| Comparação | `==`, `!=`, `>`, `<`, `>=`, `<=` |
| Lógicos | `and`, `or`, `not` |
| Pertencimento | `in`, `not in` |
"""

# ══════════════════════════════════════════════════════════════════════
# Módulo 4 — Estruturas de Repetição
# ══════════════════════════════════════════════════════════════════════

_MD_LOOP_1 = """\
# Laço while

O laço `while` repete um bloco de código **enquanto** uma condição
for verdadeira. É ideal quando você **não sabe** quantas vezes o
loop vai executar.

---

## Estrutura básica

```python
contador = 1

while contador <= 5:
    print(contador)
    contador += 1
# Imprime: 1, 2, 3, 4, 5
```

## Loop infinito controlado

```python
while True:
    senha = input("Digite a senha: ")
    if senha == "python123":
        print("Acesso permitido!")
        break
    print("Senha incorreta, tente novamente.")
```

## break e continue

- **`break`** — interrompe o loop imediatamente
- **`continue`** — pula para a próxima iteração

```python
# Exemplo com break
for i in range(10):
    if i == 5:
        break    # Para quando i chega a 5
    print(i)     # Imprime 0, 1, 2, 3, 4

# Exemplo com continue
for i in range(5):
    if i == 2:
        continue  # Pula o 2
    print(i)      # Imprime 0, 1, 3, 4
```

## Acumuladores

Um padrão muito comum é usar variáveis para **acumular** valores:

```python
soma = 0
n = int(input("Quantos números? "))

for i in range(n):
    valor = int(input(f"Número {i+1}: "))
    soma += valor

print(f"Soma total: {soma}")
```

---

## Resumo

| Conceito | Uso |
|----------|-----|
| `while cond:` | Repete enquanto condição for True |
| `while True:` | Loop infinito (use `break` para sair) |
| `break` | Interrompe o loop |
| `continue` | Pula para próxima iteração |
"""

_MD_LOOP_2 = """\
# Laço for e range()

O laço `for` é usado para **iterar** sobre sequências (listas, strings,
ranges, etc.). É a forma mais "pythônica" de fazer repetições.

---

## for com range()

```python
# range(fim) — de 0 até fim-1
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# range(inicio, fim)
for i in range(1, 6):
    print(i)  # 1, 2, 3, 4, 5

# range(inicio, fim, passo)
for i in range(0, 10, 2):
    print(i)  # 0, 2, 4, 6, 8

# Contagem regressiva
for i in range(5, 0, -1):
    print(i)  # 5, 4, 3, 2, 1
```

## for com strings

```python
for letra in "Python":
    print(letra)
# P, y, t, h, o, n
```

## for com listas

```python
frutas = ["maçã", "banana", "uva"]

for fruta in frutas:
    print(f"Eu gosto de {fruta}")
```

## enumerate()

Quando você precisa do **índice** e do **valor**:

```python
cores = ["vermelho", "azul", "verde"]

for i, cor in enumerate(cores):
    print(f"{i}: {cor}")
# 0: vermelho
# 1: azul
# 2: verde
```

## Tabuada — exemplo prático

```python
n = int(input("Tabuada de: "))

for i in range(1, 11):
    print(f"{n} x {i} = {n * i}")
```

---

## Resumo

| Função | Exemplo | Produz |
|--------|---------|--------|
| `range(5)` | `for i in range(5)` | 0, 1, 2, 3, 4 |
| `range(1, 6)` | `for i in range(1, 6)` | 1, 2, 3, 4, 5 |
| `range(0, 10, 2)` | `for i in range(0, 10, 2)` | 0, 2, 4, 6, 8 |
| `enumerate(seq)` | `for i, v in enumerate(seq)` | índice + valor |
"""

# ══════════════════════════════════════════════════════════════════════
# Módulo 5 — Funções
# ══════════════════════════════════════════════════════════════════════

_MD_FUNC_1 = """\
# Definindo Funções

**Funções** são blocos de código reutilizáveis que executam uma tarefa
específica. Elas ajudam a organizar o código e evitar repetição.

---

## Criando uma função

```python
def saudacao(nome):
    \"\"\"Retorna uma saudação personalizada.\"\"\"
    return f"Olá, {nome}!"

# Chamando a função
mensagem = saudacao("Maria")
print(mensagem)  # Olá, Maria!
```

## Anatomia de uma função

```python
def nome_da_funcao(parametro1, parametro2):
    \"\"\"Docstring — descreve o que a função faz.\"\"\"
    # corpo da função
    resultado = parametro1 + parametro2
    return resultado
```

| Parte | Descrição |
|-------|-----------|
| `def` | Palavra-chave que define a função |
| Nome | Identificador (snake_case) |
| Parâmetros | Valores que a função recebe |
| Docstring | Documentação da função |
| `return` | Valor que a função devolve |

## Funções sem return

Se a função não tiver `return`, ela retorna `None`:

```python
def mostrar_mensagem(msg):
    print(f">>> {msg}")

resultado = mostrar_mensagem("Oi")
print(resultado)  # None
```

## Exemplos práticos

```python
def eh_par(n):
    \"\"\"Verifica se um número é par.\"\"\"
    return n % 2 == 0

def dobro(n):
    \"\"\"Retorna o dobro de um número.\"\"\"
    return n * 2

print(eh_par(4))   # True
print(eh_par(7))   # False
print(dobro(5))    # 10
```

---

## Resumo

| Conceito | Exemplo |
|----------|---------|
| Definir | `def func(param):` |
| Retornar | `return valor` |
| Chamar | `func(argumento)` |
| Docstring | `\"\"\"Descrição\"\"\"` |
"""

_MD_FUNC_2 = """\
# Parâmetros e Retorno

Funções podem receber dados (parâmetros) e devolver resultados
(retorno). Vamos explorar as diferentes formas de trabalhar com eles.

---

## Parâmetros posicionais e nomeados

```python
def apresentar(nome, idade):
    print(f"{nome} tem {idade} anos")

# Posicional
apresentar("Maria", 25)

# Nomeado (keyword)
apresentar(idade=25, nome="Maria")
```

## Valores padrão

```python
def saudacao(nome, idioma="pt"):
    if idioma == "pt":
        return f"Olá, {nome}!"
    elif idioma == "en":
        return f"Hello, {nome}!"

print(saudacao("Maria"))        # Olá, Maria!
print(saudacao("Maria", "en"))  # Hello, Maria!
```

## Retornando múltiplos valores

```python
def dividir(a, b):
    quociente = a // b
    resto = a % b
    return quociente, resto

q, r = dividir(17, 5)
print(f"Quociente: {q}, Resto: {r}")
# Quociente: 3, Resto: 2
```

## *args e **kwargs

```python
# *args — aceita qualquer número de argumentos posicionais
def soma(*numeros):
    return sum(numeros)

print(soma(1, 2, 3))      # 6
print(soma(10, 20, 30, 40)) # 100

# **kwargs — aceita argumentos nomeados
def info(**dados):
    for chave, valor in dados.items():
        print(f"{chave}: {valor}")

info(nome="Ana", idade=20, cidade="SP")
```

## Escopo de variáveis

```python
x = 10  # variável global

def funcao():
    x = 20  # variável local (diferente da global!)
    print(f"Local: {x}")

funcao()        # Local: 20
print(f"Global: {x}")  # Global: 10
```

> ⚠️ **Cuidado com escopo!** Variáveis criadas dentro de funções
> só existem dentro delas.

---

## Resumo

| Recurso | Exemplo |
|---------|---------|
| Valor padrão | `def f(x, y=0):` |
| Múltiplos retornos | `return a, b` |
| *args | `def f(*args):` |
| **kwargs | `def f(**kwargs):` |
"""

# ══════════════════════════════════════════════════════════════════════
# Módulo 6 — Listas e Estruturas de Dados
# ══════════════════════════════════════════════════════════════════════

_MD_LIST_1 = """\
# Listas em Python

**Listas** são coleções ordenadas e mutáveis que podem armazenar
qualquer tipo de dado. Elas são uma das estruturas mais versáteis
do Python.

---

## Criando listas

```python
# Lista de números
numeros = [1, 2, 3, 4, 5]

# Lista de strings
frutas = ["maçã", "banana", "uva"]

# Lista mista
mista = [1, "dois", 3.0, True]

# Lista vazia
vazia = []
```

## Acessando elementos

```python
frutas = ["maçã", "banana", "uva", "laranja"]

frutas[0]    # "maçã" (primeiro)
frutas[-1]   # "laranja" (último)
frutas[1:3]  # ["banana", "uva"] (fatia)
```

## Modificando listas

```python
frutas = ["maçã", "banana", "uva"]

# Adicionar ao final
frutas.append("laranja")    # ["maçã", "banana", "uva", "laranja"]

# Inserir em posição específica
frutas.insert(1, "manga")   # ["maçã", "manga", "banana", ...]

# Remover por valor
frutas.remove("banana")

# Remover por índice
del frutas[0]

# Remover e retornar o último
ultimo = frutas.pop()
```

## Funções úteis com listas

```python
numeros = [3, 1, 4, 1, 5, 9, 2, 6]

len(numeros)     # 8 (tamanho)
sum(numeros)     # 31 (soma)
min(numeros)     # 1 (menor)
max(numeros)     # 9 (maior)
sorted(numeros)  # [1, 1, 2, 3, 4, 5, 6, 9] (nova lista ordenada)
```

## Iterando sobre listas

```python
notas = [8.5, 7.0, 9.2, 6.8]

for nota in notas:
    print(f"Nota: {nota}")

# Com índice
for i, nota in enumerate(notas):
    print(f"Prova {i+1}: {nota}")
```

---

## Resumo

| Operação | Método | Exemplo |
|----------|--------|---------|
| Adicionar | `.append(x)` | `lista.append(4)` |
| Inserir | `.insert(i, x)` | `lista.insert(0, 1)` |
| Remover | `.remove(x)` | `lista.remove(3)` |
| Ordenar | `.sort()` | `lista.sort()` |
| Tamanho | `len(lista)` | `len([1,2,3])` → `3` |
"""

_MD_LIST_2 = """\
# List Comprehension

**List comprehension** é uma forma concisa e elegante de criar
listas em Python. É uma das features mais queridas da linguagem! 🐍

---

## Sintaxe básica

```python
# Forma tradicional
quadrados = []
for i in range(1, 6):
    quadrados.append(i ** 2)
# [1, 4, 9, 16, 25]

# Com list comprehension ✨
quadrados = [i ** 2 for i in range(1, 6)]
# [1, 4, 9, 16, 25]
```

## Com condição (filtro)

```python
# Apenas números pares
pares = [x for x in range(10) if x % 2 == 0]
# [0, 2, 4, 6, 8]

# Números maiores que 5
maiores = [x for x in range(10) if x > 5]
# [6, 7, 8, 9]
```

## Com transformação e condição

```python
# Quadrados dos pares
quadrados_pares = [x**2 for x in range(10) if x % 2 == 0]
# [0, 4, 16, 36, 64]

# Transformar strings
nomes = ["ana", "beto", "carla"]
maiusculos = [nome.upper() for nome in nomes]
# ["ANA", "BETO", "CARLA"]
```

## Expressão condicional (if/else)

```python
numeros = [1, 2, 3, 4, 5]
resultado = ["par" if x % 2 == 0 else "ímpar" for x in numeros]
# ["ímpar", "par", "ímpar", "par", "ímpar"]
```

## Exemplos práticos

```python
# Filtrar palavras longas
palavras = ["oi", "python", "eu", "programação"]
longas = [p for p in palavras if len(p) > 3]
# ["python", "programação"]

# Converter lista de strings para inteiros
textos = ["1", "2", "3", "4"]
numeros = [int(t) for t in textos]
# [1, 2, 3, 4]

# Achatar lista de listas
matriz = [[1, 2], [3, 4], [5, 6]]
plana = [x for linha in matriz for x in linha]
# [1, 2, 3, 4, 5, 6]
```

> 💡 **Dica:** Use list comprehension quando a lógica for simples.
> Para lógica complexa, prefira um `for` tradicional — legibilidade
> é mais importante que concisão!

---

## Resumo

| Padrão | Exemplo |
|--------|---------|
| Básico | `[x for x in seq]` |
| Com filtro | `[x for x in seq if cond]` |
| Com transformação | `[f(x) for x in seq]` |
| Com if/else | `[a if cond else b for x in seq]` |
"""
