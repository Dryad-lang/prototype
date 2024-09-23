# Regras da Linguagem

## 1. Blocos
Um bloco de código é delimitado por chaves (`{}`). Ele pode conter uma ou mais instruções, e a sintaxe é a seguinte:
```plaintext
{
    instrução1;
    instrução2;
    ...
}
```

## 2. Estruturas de Controle

### 2.1. Condicional `if`
A estrutura `if` permite executar um bloco de código com base em uma condição:
```plaintext
if (condição) {
    // bloco de código
} else {
    // bloco de código alternativo (opcional)
}
```

### 2.2. Laços

#### 2.2.1. `for`
O laço `for` permite repetir um bloco de código um número determinado de vezes:
```plaintext
for (inicialização; condição; atualização) {
    // bloco de código
}
```

#### 2.2.2. `while`
O laço `while` executa um bloco de código enquanto a condição for verdadeira:
```plaintext
while (condição) {
    // bloco de código
}
```

#### 2.2.3. `do while`
O laço `do while` executa o bloco de código uma vez antes de verificar a condição:
```plaintext
do {
    // bloco de código
} while (condição);
```

## 3. Instruções
Uma instrução é uma operação que deve ser executada, como atribuição ou chamada de função, e deve terminar com um ponto e vírgula (`;`):
```plaintext
variável = expressão;
```

## 4. Atribuições
A sintaxe para atribuições pode incluir operações:
```plaintext
variável = valor;       // Atribuição simples
variável += valor;      // Atribuição com soma
variável -= valor;      // Atribuição com subtração
```

## 5. Operadores
A linguagem suporta vários operadores, organizados por precedência:
- **Operadores lógicos**: `||`, `&&`, `!`
- **Operadores de comparação**: `==`, `!=`, `<`, `>`, `<=`, `>=`
- **Operadores aritméticos**: `+`, `-`, `*`, `/`, `%`
- **Operadores de atribuição**: `=`, `+=`, `-=`, etc.

## 6. Funções
Funções podem ser definidas e chamadas na seguinte sintaxe:
```plaintext
function nomeFuncao(parâmetros) {
    // bloco de código
}
```

### Chamada de Função
A chamada de função é feita utilizando o nome da função seguido de parênteses:
```plaintext
nomeFuncao(argumento1, argumento2);
```

## 7. Unários
Os operadores unários, como `++`, `--`, e `-` podem ser usados antes de uma variável ou valor:
```plaintext
-variável;
variável++;
```

## 8. Valores
A linguagem suporta diferentes tipos de valores:
- Números: `42`
- Strings: `"texto"`
- Identificadores: `variavel`