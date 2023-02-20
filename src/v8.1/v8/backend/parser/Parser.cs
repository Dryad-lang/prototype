using v8.backend.lexer;
using v8.backend.lexer.types;

namespace v8.backend.parser
{
    public interface INode
    {
        Token Value { get;}
        bool IsTerminal { get; }
        INode Parent { get; }
        INode[] Children { get; }
        void AddChild(INode child);
        void AddParent(INode parent);
        void AddValue(Token value);
    }

    public interface IAst
    {
        INode Root { get; }
    }

    public class Node : INode
    {
        public Token Value { get; private set; }
        public bool IsTerminal { get; private set; }
        public INode Parent { get; private set; }
        public INode[] Children { get; private set; }

        public Node(Token value, bool isTerminal)
        {
            Value = value;
            IsTerminal = isTerminal;
            Children = new INode[0];
        }

        public void AddChild(INode child)
        {
            var newChildren = new INode[Children.Length + 1];
            for (int i = 0; i < Children.Length; i++)
            {
                newChildren[i] = Children[i];
            }
            newChildren[Children.Length] = child;
            Children = newChildren;
        }

        public void AddParent(INode parent)
        {
            Parent = parent;
        }

        public void AddValue(Token value)
        {
            Value = value;
        }
    }

    public class MathParser
    {
        private List<Token> _tokens;
        private Token currentToken;

        public MathParser(List<Token> tokens)
        {
            _tokens = tokens;
            currentToken = _tokens[0];
        }

        public MathTree Parse()
        {
            var tree = new MathTree();
            var rootNode = Expression();
            tree.Root.AddChild(rootNode);

            return tree;
        }

        private Node Expression()
        {
            var leftNode = Term();
            while (currentToken.type == Types.MathOP_PLUS || currentToken.type == Types.MathOP_MINUS)
            {
                var opNode = new Node(currentToken, true);
                opNode.AddChild(leftNode);
                leftNode.AddParent(opNode);
                currentToken = GetNextToken();
                var rightNode = Term();
                opNode.AddChild(rightNode);
                rightNode.AddParent(opNode);
                leftNode = opNode;
            }
            return leftNode;
        }

        private Node Term()
        {
            var leftNode = Factor();
            while (
                currentToken.type == Types.MathOP_MULT 
                || currentToken.type == Types.MathOP_DIV 
                || currentToken.type == Types.MathOP_MOD)
            {
                var opNode = new Node(currentToken, true);
                opNode.AddChild(leftNode);
                leftNode.AddParent(opNode);
                currentToken = GetNextToken();
                var rightNode = Factor();
                opNode.AddChild(rightNode);
                rightNode.AddParent(opNode);
                leftNode = opNode;
            }
            return leftNode;
        }

        private Node Factor()
        {
            var leftNode = Power();
            while (currentToken.type == Types.MathOP_POW)
            {
                var opNode = new Node(currentToken, true);
                opNode.AddChild(leftNode);
                leftNode.AddParent(opNode);
                currentToken = GetNextToken();
                var rightNode = Power();
                opNode.AddChild(rightNode);
                rightNode.AddParent(opNode);
                leftNode = opNode;
            }
            return leftNode;
        }

        private Node Power()
        {
            var node = new Node(currentToken, false);
            if (currentToken.type == Types.INTEGER_TYPE || currentToken.type == Types.FLOAT_TYPE)
            {
                node.AddValue(currentToken);
                currentToken = GetNextToken();
            }
            else if (currentToken.type == Types.MathOP_MINUS)
            {
                var opNode = new Node(currentToken, true);
                currentToken = GetNextToken();
                var childNode = Power();
                opNode.AddChild(childNode);
                childNode.AddParent(opNode);
                node = opNode;
            }
            else if (currentToken.type == Types.L_PAREN)
            {
                currentToken = GetNextToken();
                node = Expression();
                if (currentToken.type != Types.R_PAREN)
                {
                    throw new Exception("Expected ')'");
                }
                currentToken = GetNextToken();
            }
            else
            {
                throw new Exception("Invalid syntax");
            }
            return node;
        }

        private Token GetNextToken()
        {
            var currentIndex = _tokens.IndexOf(currentToken);
            if (currentIndex < _tokens.Count - 1)
            {
                currentToken = _tokens[currentIndex + 1];
            }
            else
            {
                currentToken = Token.EmptyToken();
            }
            return currentToken;
        }
    }

    public class MathTree
    {
        public INode Root { get; private set; }

        public MathTree()
        {
            Root = new Node(Token.EmptyToken(), false);
        }

        public void Print()
        {
            var queue = new Queue<INode>();
            queue.Enqueue(Root);
            while (queue.Count > 0)
            {
                var node = queue.Dequeue();
                if (node.IsTerminal)
                {
                    Console.Write(node.Value.value);
                }
                else
                {
                    Console.Write(node.Value.type);
                }
                for (int i = 0; i < node.Children.Length; i++)
                {
                    queue.Enqueue(node.Children[i]);
                }
            }
        }
    }

    public class MathInterpreter
    {
        private MathTree _tree;
        
        public MathInterpreter(MathTree tree)
        {
            _tree = tree;
        }

        public float Evaluate()
        {
            System.Console.WriteLine(_tree.Root.Children[0].Value.value + " " + _tree.Root.Children[0].Value.type);
            // return EvaluateNode(_tree.Root.Children[1]);
            return 0;
        }

        private float EvaluateNode(INode node)
        {
            if (node.IsTerminal)
            {
                return float.Parse(node.Value.value);
            }
            else
            {
                float left = EvaluateNode(node.Children[0]);
                float right = EvaluateNode(node.Children[1]);

                switch (node.Value.type)
                {
                    case Types.MathOP_PLUS:
                        return left + right;
                    case Types.MathOP_MINUS:
                        return left - right;
                    case Types.MathOP_MULT:
                        return left * right;
                    case Types.MathOP_DIV:
                        return left / right;
                    case Types.MathOP_MOD:
                        return left % right;
                    case Types.MathOP_POW:
                        return (int)Math.Pow(left, right);
                    default:
                        throw new Exception("Unknown operator");
                }
            }
        }
    }



    // public class MathParser
    // {
    //     private readonly MathETree _tree;
    //     private readonly Lexer _lexer;

    //     public MathParser(string input)
    //     {
    //         _lexer = new Lexer(input);
    //         _tree = new MathETree();
    //     }

    //     public double Parse()
    //     {
    //         NextToken();

    //         var result = ParseExpression();

    //         if (_lexer.CurrentToken.Type != TokenType.Eof)
    //         {
    //             throw new Exception("Unexpected token");
    //         }

    //         return result;
    //     }

    //     private void NextToken()
    //     {
    //         _lexer.NextToken();
    //     }

    //     private double ParseExpression()
    //     {
    //         var result = ParseTerm();

    //         while (_lexer.CurrentToken.Type == TokenType.Plus || _lexer.CurrentToken.Type == TokenType.Minus)
    //         {
    //             var op = _lexer.CurrentToken;
    //             NextToken();

    //             var term = ParseTerm();

    //             if (op.Type == TokenType.Plus)
    //             {
    //                 result += term;
    //             }
    //             else
    //             {
    //                 result -= term;
    //             }
    //         }

    //         return result;
    //     }

    //     private double ParseTerm()
    //     {
    //         var result = ParseFactor();

    //         while (_lexer.CurrentToken.Type == TokenType.Multiply || _lexer.CurrentToken.Type == TokenType.Divide)
    //         {
    //             var op = _lexer.CurrentToken;
    //             NextToken();

    //             var factor = ParseFactor();

    //             if (op.Type == TokenType.Multiply)
    //             {
    //                 result *= factor;
    //             }
    //             else
    //             {
    //                 result /= factor;
    //             }
    //         }

    //         return result;
    //     }

    //     private double ParseFactor()
    //     {
    //         var token = _lexer.CurrentToken;

    //         if (token.Type == TokenType.Number)
    //         {
    //             NextToken();
    //             return double.Parse(token.Value);
    //         }
    //         else if (token.Type == TokenType.LeftParen)
    //         {
    //             NextToken();
    //             var result = ParseExpression();

    //             if (_lexer.CurrentToken.Type != TokenType.RightParen)
    //             {
    //                 throw new Exception("Expected ')'");
    //             }

    //             NextToken();
    //             return result;
    //         }
    //         else
    //         {
    //             throw new Exception("Unexpected token");
    //         }
    //     }
    // }

}