using System.Collections.Generic;
using System;
using System.Text;

/*
We use two types of parsers:

1. A for grammar rules
2. B for mathematical expressions

The gramar rules use stack methods to parse the input string.

using the following grammar rules:

The robot stroked two furry dices
int a = 5;

<subj> ::= <art> | <noum> -> the robot | type indentifyer | int a;

<art> ::= the a | an a | a | the | an | type | int

<noum> ::= robot | indentifyer | a

<verb> ::= bited | kicked | stoked | (any action exemple: function, method, etc) | =

<obj> ::= <art> <noum> | two furry dice(obj) | 5 - integer 

result stack:

1ª
<art>: the 
<verb>: stroked
<obj>: two furry dices

2ª
<art>: int
<subj>: a
<verb>: =
<obj>: 5

This way the parser need to try to match the input string with the grammar rules.
and stacking each for maching rule stack.


The mathematical expressions use the shunting yard algorithm to parse the input string.

we use a top down tree to parse the mathematical expressions.


example:

5 + 5 * 5

we use the following tree:

        +
       / \
      5   *
         / \
        5   5

the ast is divide by tree types:


expresions, terms and factors.


exemple:

(5 + 5) * 5

        *
       / \
      +   5
     / \
    5   5

expresion: ( term: ( factor: 5 ) + term: ( ( factor: 5 ) * ( factor: 5 ) ) )


*/
namespace v6
{
    public class Node
    {
        public Token value;
        public Node? left;
        public Node? right;
        public Node(Token value, Node? left = null, Node? right = null)
        {
            this.value = value;
            this.left = left;
            this.right = right;
        }
    }

    public class AST
    {
        public Node root;
        public AST(Node root)
        {
            this.root = root;
        }
    }

    public class MathExpressions
    {
        public static AST Parse(string input)
        {
            var tokens = Tokenize(input);
            var rpn = ShuntingYard(tokens);
            var ast = BuildAST(rpn);
            return ast;
        }

        private static List<Token> Tokenize(string input)
        {
            var tokens = new List<Token>();
            var sb = new StringBuilder();
            foreach (var c in input)
            {
                if (char.IsDigit(c))
                {
                    sb.Append(c);
                }
                else
                {
                    if (sb.Length > 0)
                    {
                        tokens.Add(new Token(TokenType.Number, sb.ToString()));
                        sb.Clear();
                    }
                    tokens.Add(new Token(TokenType.Operator, c.ToString()));
                }
            }
            if (sb.Length > 0)
            {
                tokens.Add(new Token(TokenType.Number, sb.ToString()));
            }
            return tokens;
        }

        private static List<Token> ShuntingYard(List<Token> tokens)
        {
            var output = new List<Token>();
            var stack = new Stack<Token>();
            foreach (var token in tokens)
            {
                if (token.Type == TokenType.Number)
                {
                    output.Add(token);
                }
                else if (token.Type == TokenType.Operator)
                {
                    while (stack.Count > 0 && stack.Peek().Type == TokenType.Operator)
                    {
                        output.Add(stack.Pop());
                    }
                    stack.Push(token);
                }
            }
            while (stack.Count > 0)
            {
                output.Add(stack.Pop());
            }
            return output;
        }

        private static AST BuildAST(List<Token> tokens)
        {
            var stack = new Stack<Node>();
            foreach (var token in tokens)
            {
                if (token.Type == TokenTypes.Number)
                {
                    stack.Push(new Node(token));
                }
                else if (token.type == TokenTypes.Operator)
                {
                    var right = stack.Pop();
                    var left = stack.Pop();
                    stack.Push(new Node(token, left, right));
                }
            }
            return new AST(stack.Pop());
        }
    }

    public class Parser
    {

    }
}
