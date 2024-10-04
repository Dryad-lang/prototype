## Módulos Importados

O parser utiliza diversos módulos e estruturas para operar:

- **ast**: Módulo que define os nós da árvore sintática abstrata, incluindo definições de funções, expressões, declarações e operadores.
- **tokens**: Módulo responsável pelos tokens e suas localizações no código.

Outros pacotes e estruturas do Rust usados incluem:
- `std::cell::{Ref, RefCell}`: Gerenciamento de referências a objetos mutáveis.
- `std::error::Error`: Representação de erros que podem ocorrer durante o parsing.
- `std::iter::Peekable`: Facilita a visualização do próximo item no iterador sem consumi-lo.
- `std::result::Result`: Representa o resultado de operações que podem falhar.

## Estruturas

### ParserIterator

`ParserIterator<'a>` é a estrutura principal do parser. Ela armazena um iterador sobre os tokens fornecidos e contém os métodos para processar esses tokens e construir a AST.

```rust
pub struct ParserIterator<'a> {
    tokens_iter: Peekable<Box<dyn Iterator<Item = Token> + 'a>>,
}
```

#### Métodos principais

1. **new**: Inicializa o parser a partir de um `TokenizerIterator`.
    ```rust
    pub fn new(tokenizer: TokenizerIterator<'a>) -> Self;
    ```

2. **consume_token**: Verifica se o próximo token é do tipo esperado. Se sim, avança o iterador e retorna o token, caso contrário, lança um erro.
    ```rust
    pub(self) fn consume_token(&mut self, token_type: TokenType, message: String) -> Result<Option<RefCell<Token>>, Box<dyn Error>>;
    ```

3. **advance_token**: Avança o iterador para o próximo token.
    ```rust
    pub(self) fn advance_token(&mut self) -> Option<RefCell<Token>>;
    ```

4. **peek_token**: Permite visualizar o próximo token sem consumi-lo.
    ```rust
    pub(self) fn peek_token(&mut self) -> Option<&Token>;
    ```

5. **ast**: Cria a estrutura sintática do programa (AST) a partir de uma lista de declarações.
    ```rust
    pub fn ast(&mut self) -> Result<ProgramStmt, Box<dyn Error>>;
    ```

6. **statement**: Processa declarações de forma geral, chamando métodos mais específicos com base no tipo de token encontrado.
    ```rust
    pub fn statement(&mut self) -> Result<Stmt, Box<dyn Error>>;
    ```

7. **expression_statement**: Analisa uma expressão e espera um ponto e vírgula (`;`) no final.
    ```rust
    pub fn expression_statement(&mut self) -> Result<Stmt, Box<dyn Error>>;
    ```

8. **declaration**: Verifica o tipo de declaração (variável, função, bloco, etc.) e invoca o método apropriado.
    ```rust
    pub fn declaration(&mut self, token: Ref<'_, Token>) -> Result<Stmt, Box<dyn Error>>;
    ```

## Declarações

Existem vários métodos dedicados para processar diferentes tipos de declarações:

1. **var_declaration**: Analisa a declaração de uma variável, esperando um identificador, seguido por dois pontos `:`, um tipo, e uma expressão de inicialização.
    ```rust
    pub fn var_declaration(&mut self, _token: Ref<'_, Token>) -> Result<Stmt, Box<dyn Error>>;
    ```

2. **const_declaration**: Similar à declaração de variável, mas para constantes.
    ```rust
    pub fn const_declaration(&mut self, _token: Ref<'_, Token>) -> Result<Stmt, Box<dyn Error>>;
    ```

3. **func_declaration**: Analisa a declaração de uma função, esperando um nome, parâmetros e um corpo.
    ```rust
    pub fn func_declaration(&mut self, _token: Ref<'_, Token>) -> Result<Stmt, Box<dyn Error>>;
    ```

4. **block_declaration**: Processa um bloco de código cercado por `{` e `}`, permitindo várias declarações ou expressões dentro do bloco.
    ```rust
    pub fn block_declaration(&mut self, location: Location) -> Result<Stmt, Box<dyn Error>>;
    ```

5. **if_declaration**: Processa uma declaração `if`, analisando a condição e os blocos `then` e `else`.
    ```rust
    pub fn if_declaration(&mut self, token: Ref<'_, Token>) -> Result<Stmt, Box<dyn Error>>;
    ```

## Estados da Declaração de Função

O parser utiliza uma enumeração para gerenciar o estado da declaração de funções:

```rust
#[derive(PartialEq)]
enum FuncDeclState {
    Comma,  // Esperando uma vírgula após um argumento
    Arg,    // Esperando um argumento
    End     // Fim da lista de argumentos
}
```

Isso ajuda a garantir que os argumentos e vírgulas estejam bem formatados durante a análise.
