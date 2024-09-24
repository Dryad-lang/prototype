# Regras Base para o Parser

Este documento descreve as regras base que podem ser usadas na implementação do parser para a linguagem em desenvolvimento. As regras baseiam-se nos tokens gerados pelo lexer existente e visam descrever como esses tokens são organizados para formar expressões, blocos de código, e outras construções da linguagem.

## 1. Regras de Expressão

### 1.1 Expressões Aritméticas

As expressões aritméticas podem envolver operadores como soma, subtração, multiplicação, divisão e parênteses. A recursão é usada para avaliar expressões aninhadas.

```plaintext
<expression> ::= <term> (("+" | "-") <term>)*
<term>       ::= <factor> (("*" | "/") <factor>)*
<factor>     ::= <number> | <identifier> | "(" <expression> ")"
```

**Descrição:**

- Um `<expression>` consiste em um ou mais `<term>` separados por operadores de soma ou subtração.
- Um `<term>` consiste em um ou mais `<factor>` separados por operadores de multiplicação ou divisão.
- Um `<factor>` pode ser um número, um identificador (variável) ou uma expressão entre parênteses.

### 1.2 Expressões Relacionais

As expressões relacionais são usadas para comparar valores e retornar um booleano.

```plaintext
<relational_expression> ::= <expression> (("==" | "!=" | "<" | ">" | "<=" | ">=") <expression>)*
```

**Descrição:**

- Uma `<relational_expression>` compara duas expressões com operadores como igual (`==`), diferente (`!=`), menor que (`<`), maior que (`>`), e outros. A avaliação é feita recursivamente.

## 2. Regras de Controle de Fluxo

### 2.1 Declaração `if-else`

A estrutura condicional `if-else` segue a forma básica de testar uma condição e executar um bloco de código condicionalmente.

```plaintext
<if_statement> ::= "if" "(" <expression> ")" <block> ("else" <block>)?
<block>        ::= "{" <statement>* "}"
```

**Descrição:**

- Um `<if_statement>` avalia uma expressão condicional e executa um bloco de código se a condição for verdadeira.
- A construção opcional `else` permite que outro bloco seja executado caso a condição seja falsa.
- Um `<block>` consiste em uma ou mais instruções (`<statement>`).

### 2.2 Declaração `while`

A estrutura de repetição `while` executa um bloco de código repetidamente enquanto uma condição for verdadeira.

```plaintext
<while_statement> ::= "while" "(" <expression> ")" <block>
```

**Descrição:**

- A `<while_statement>` repete o bloco de código enquanto a condição dentro dos parênteses for avaliada como verdadeira.

## 3. Regras de Declarações

### 3.1 Declaração de Variáveis

As variáveis podem ser declaradas com palavras-chave como `var`, `const` ou `let`.

```plaintext
<var_declaration> ::= ("var" | "const" | "let") <identifier> ("=" <expression>)? ";"
```

**Descrição:**

- Uma `<var_declaration>` define uma variável com um nome (`<identifier>`) e opcionalmente atribui um valor inicial com uma expressão.
- A palavra-chave pode variar entre `var`, `const` ou `let`, dependendo do tipo de variável.

### 3.2 Declaração de Funções

Funções são blocos de código reutilizáveis que podem ser declarados e invocados posteriormente.

```plaintext
<function_declaration> ::= "function" <identifier> "(" <parameter_list>? ")" <block>
<parameter_list>       ::= <identifier> ("," <identifier>)*
```

**Descrição:**

- Uma `<function_declaration>` define uma função com um nome (`<identifier>`) e uma lista de parâmetros opcionais.
- O corpo da função é um bloco de código que será executado quando a função for invocada.

## 4. Operadores Lógicos e Binários

### 4.1 Operadores Lógicos

Operadores lógicos permitem a combinação de expressões booleanas.

```plaintext
<logical_expression> ::= <expression> (("&&" | "||") <expression>)*
```

**Descrição:**

- Uma `<logical_expression>` usa operadores lógicos `&&` (e lógico) e `||` (ou lógico) para combinar expressões booleanas.

### 4.2 Operadores Binários

Operadores binários manipulam bits em números inteiros.

```plaintext
<binary_expression> ::= <expression> (("&" | "|" | "^" | "<<" | ">>") <expression>)*
```

**Descrição:**

- Uma `<binary_expression>` aplica operações binárias como `&` (AND binário), `|` (OR binário), `^` (XOR binário), e deslocamentos de bits (`<<`, `>>`) entre expressões numéricas.

## 5. Funções e Invocação

### 5.1 Invocação de Função

Funções podem ser invocadas usando o nome da função seguido de uma lista de argumentos.

```plaintext
<function_call> ::= <identifier> "(" <argument_list>? ")"
<argument_list> ::= <expression> ("," <expression>)*
```

**Descrição:**

- Um `<function_call>` envolve o nome de uma função seguido por parênteses que contêm uma lista opcional de argumentos.
- A `<argument_list>` consiste em uma ou mais expressões separadas por vírgulas.

## 6. Blocos e Instruções

### 6.1 Bloco de Código

Um bloco de código é uma sequência de instruções agrupadas entre chaves `{}`.

```plaintext
<block> ::= "{" <statement>* "}"
```

**Descrição:**

- Um `<block>` agrupa várias instruções em uma única unidade que pode ser executada em sequência.

### 6.2 Instrução

As instruções são elementos fundamentais do código que realizam ações, como atribuições, chamadas de função ou controle de fluxo.

```plaintext
<statement> ::= <var_declaration> | <if_statement> | <while_statement> | <expression> ";"
```

**Descrição:**

- Um `<statement>` pode ser uma declaração de variável, uma instrução `if`, uma estrutura `while` ou uma expressão terminada por ponto e vírgula.

---


### Melhorias sugeridas:

1. **Abordagem modular:** Divida o parser em funções específicas para cada regra gramatical para facilitar manutenção e expansão.
2. **Recursão à esquerda:** Remova possíveis casos de recursão à esquerda em expressões para evitar loops infinitos no parser.
3. **Erros sintáticos:** Adicione mecanismos para capturar e reportar erros de sintaxe com informações sobre linha e coluna.
