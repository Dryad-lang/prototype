# Parser para Linguagem Customizada

Este documento descreve a estrutura e funcionamento do parser desenvolvido para uma linguagem customizada, baseado em um conjunto de tokens gerados pelo tokenizer. O parser transforma a sequência de tokens em uma árvore sintática abstrata (AST).

## Módulos

- `ast`: Contém definições das estruturas de dados usadas para representar a árvore sintática abstrata (AST).
- `tokens`: Define os tipos de tokens e suas localizações no código-fonte.

## Estruturas e Enumerações

### `ParserIterator`

A estrutura `ParserIterator` é responsável por iterar sobre uma sequência de tokens. Ela usa um `Peekable` para verificar tokens futuros sem consumi-los.

#### Campos

- `tokens_iter`: Iterador sobre os tokens gerados pelo tokenizer.

#### Métodos

- `new(tokenizer: TokenizerIterator) -> ParserIterator`: Inicializa um novo `ParserIterator` a partir de um iterador de tokens.
- `advance_token() -> Option<RefCell<Token>>`: Consome o próximo token do iterador.
- `peek_token() -> Option<&Token>`: Retorna uma referência ao próximo token sem consumi-lo.
- `consume_token(token_type: TokenType, message: String) -> Result<Option<RefCell<Token>>, Box<dyn Error>>`: Consome o token atual se ele corresponder ao tipo esperado, caso contrário, lança um erro.
- `ast() -> Result<ProgramStmt, Box<dyn Error>>`: Processa a sequência de tokens e constrói o programa representado como uma AST.

### `FuncDeclState`

Enumeração usada para controlar o estado da declaração de uma função:

- `Comma`: Espera uma vírgula entre os argumentos.
- `Arg`: Espera um argumento.
- `End`: Finaliza a declaração da função.

## Principais Funções do Parser

### Declarações

- `declaration(token: Ref<Token>) -> Result<Stmt, Box<dyn Error>>`: Identifica e processa diferentes tipos de declarações (variáveis, funções, blocos, etc.).
- `var_declaration(token: Ref<Token>) -> Result<Stmt, Box<dyn Error>>`: Processa a declaração de uma variável com atribuição opcional de valor inicial.
- `const_declaration(token: Ref<Token>) -> Result<Stmt, Box<dyn Error>>`: Processa a declaração de uma constante, exigindo a atribuição de um valor inicial.
- `func_declaration(token: Ref<Token>) -> Result<Stmt, Box<dyn Error>>`: Processa a declaração de uma função, incluindo a coleta de parâmetros e o bloco de corpo da função.
- `block_declaration(location: Location) -> Result<Stmt, Box<dyn Error>>`: Processa blocos de código delimitados por `{}`.

### Expressões

- `expression_statement() -> Result<Stmt, Box<dyn Error>>`: Processa uma expressão seguida de um ponto e vírgula.
- `if_declaration(token: Ref<Token>) -> Result<Stmt, Box<dyn Error>>`: Processa uma declaração `if` e, opcionalmente, uma cláusula `else`.

## Exceções e Erros

O parser gera erros customizados, impressos no `stderr`, quando encontra tokens inesperados ou quando a estrutura esperada não é seguida corretamente.
