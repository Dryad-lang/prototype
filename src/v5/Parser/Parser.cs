using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks; 
using v5.Lexical;


namespace v5.Parsing
{
    /*
    
    This class is responsible for parsing the tokens into an AST.
    The AST is a tree of nodes, where each node is a token.

    Whe use top-down parsing, where we start at the root node and recursively descend down the tree.

    The parser will raise an exception if the input is invalid.

    Parser grammar:

    expr: term ((PLUS | MINUS) term)*
    term: factor ((MUL | DIV) factor)*
    factor: NUMBER(float or integer) | LPAREN expr RPAREN

    exemple: 3 + 5 * (10 - 4) -> term -> expr -> factor -> NUMBER


    */

    public class Node
    {
        public Token Token { get; set; }
        public Node Left { get; set; }
        public Node Right { get; set; }
    }

    public class Ast
    {
        public Node Root { get; set; }

        public Ast(Node root)
        {
            Root = root;
        }
    }


    public class Parser
    {
        private List<Token> _tokens;
        private int _pos;
        private Token _currentToken;

        private TokenType _tokenType = new TokenType();

        public Ast Parse(List<Token> tokens)
        {
            _tokens = tokens;
            _pos = 0;
            _currentToken = _tokens[_pos];

            Node root = Expr();

            return new Ast(root);
        }

        private void Error()
        {
            throw new Exception("Invalid syntax");
        }

        private void Advance()
        {
            _pos++;
            if (_pos > _tokens.Count - 1)
            {
                _currentToken = new Token("", _tokenType.EOF, 0, 0);
            }
            else
            {
                _currentToken = _tokens[_pos];
            }
        }

        private void Eat(string tokenType)
        {
            if (_currentToken.Type == tokenType)
            {
                Advance();
            }
            else
            {
                Error();
            }
        }

        /*
        
        Factor is the lowest level of the AST tree.
        It can be a number or an expression in parenthesis.

        exemple: 3 + 5 * (10 - 4) -> term -> expr -> factor -> NUMBER

        (10 - 4) is an + or - expression in parenthesis, so it is a factor.
        3 + 5 is an + or - expression, so it is a factor.

        */
        private Node Factor()
        {
            Token token = _currentToken;

            if (token.Type == _tokenType.INT || token.Type == _tokenType.FLOAT)
            {
                Eat(token.Type);
                return new Node { Token = token };
            }
            else if (token.Type == _tokenType.LPAREN)
            {
                Eat(_tokenType.LPAREN);
                Node node = Expr();
                Eat(_tokenType.RPAREN);
                return node;
            }
            else
            {
                Error();
                return null;
            }
        }

        private Node Term()
        {
            Node node = Factor();

            while (_currentToken.Type == _tokenType.OP_MUL || _currentToken.Type == _tokenType.OP_DIV)
            {
                Token token = _currentToken;
                if (token.Type == _tokenType.OP_MUL)
                {
                    Eat(_tokenType.OP_MUL);
                }
                else if (token.Type == _tokenType.OP_DIV)
                {
                    Eat(_tokenType.OP_DIV);
                }

                node = new Node { Token = token, Left = node, Right = Factor() };
            }

            return node;
        }

        private Node Expr()
        {
            Node node = Term();

            while (_currentToken.Type == _tokenType.OP_ADD || _currentToken.Type == _tokenType.OP_SUB)
            {
                Token token = _currentToken;
                if (token.Type == _tokenType.OP_ADD)
                {
                    Eat(_tokenType.OP_ADD);
                }
                else if (token.Type == _tokenType.OP_SUB)
                {
                    Eat(_tokenType.OP_SUB);
                }

                node = new Node { Token = token, Left = node, Right = Term() };

            }

            return node;
        }
    }


    public class AstPrinter
    {
        public string Print(Ast ast)
        {
            return Print(ast.Root);
        }

        private string Print(Node node)
        {
            if (node == null)
            {
                return "";
            }

            return "( " + Print(node.Left) + " " + node.Token.Value +  " " + Print(node.Right) + " )";
        }
    }


    public class Interpreter
    {
        public float Interpret(Ast ast)
        {
            return Visit(ast.Root);
        }

        private float Visit(Node node)
        {
            // if node is null, return 0
            if (node == null)
            {
                return 0;
            }

            // if node left and right are null, return the node value
            if (node.Left == null && node.Right == null)
            {
                return float.Parse(node.Token.Value);
            }
            
            // visit left and right nodes
            float left = Visit(node.Left);
            float right = Visit(node.Right);
            
            // if the node is an operator, apply it on the left and right values
            if (node.Token.Type == new TokenType().OP_ADD)
            {
                return left + right;
            }
            else if (node.Token.Type == new TokenType().OP_SUB)
            {
                return left - right;
            }
            else if (node.Token.Type == new TokenType().OP_MUL)
            {
                return left * right;
            }
            else if (node.Token.Type == new TokenType().OP_DIV)
            {
                return left / right;
            }

            return 0;
        }
    }
}