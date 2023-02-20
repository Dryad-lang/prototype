using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using v9.lexer;
using v9.utils;

namespace v9.parser
{
    // NODES

    public class Node
    {
        public Token token;

        public Node(Token token)
        {
            this.token = token;
        }
    }

    public class NumberNode
    {
        public Token token;

        public NumberNode(Token token)
        {
            this.token = token;
        }
    }

    public class StringNode
    {
        public Token token;

        public StringNode(Token token)
        {
            this.token = token;
        }
    }

    public class BinaryOperationNode
    {
        public Token token;
        public Node leftNode;
        public Node rightNode;

        public BinaryOperationNode(Token token, Node leftNode, Node rightNode)
        {
            this.token = token;
            this.leftNode = leftNode;
            this.rightNode = rightNode;
        } 
    }

    public class UnaryOperationNode
    {
        public Token token;
        public Node node;

        public UnaryOperationNode(Token token, Node node)
        {
            this.token = token;
            this.node = node;
        }
    }

    public class VarAcessNode
    {
        public Token token;
        public Token varNameToken;

        public VarAcessNode(Token token, Token varNameToken)
        {
            this.token = token;
            this.varNameToken = varNameToken;
        }
    }

    public class VarAssignNode
    {
        public Token token;
        public Token varNameToken;
        public Node node;

        public VarAssignNode(Token token, Token varNameToken, Node node)
        {
            this.token = token;
            this.varNameToken = varNameToken;
            this.node = node;
        }
    }

    public class IfNode
    {
        public Token token;
        public List<(Node, Node)> cases;
        public Node elseCase;

        public IfNode(Token token, List<(Node, Node)> cases, Node elseCase)
        {
            this.token = token;
            this.cases = cases;
            this.elseCase = elseCase;
        }
    }

    public class ForNode
    {
        public Token token;
        public Node varNameNode;
        public Node startValueNode;
        public Node endValueNode;
        public Node stepValueNode;
        public Node bodyNode;

        public ForNode(Token token, Node varNameNode, Node startValueNode, Node endValueNode, Node stepValueNode, Node bodyNode)
        {
            this.token = token;
            this.varNameNode = varNameNode;
            this.startValueNode = startValueNode;
            this.endValueNode = endValueNode;
            this.stepValueNode = stepValueNode;
            this.bodyNode = bodyNode;
        }
    }

    public class WhileNode
    {
        public Token token;
        public Node conditionNode;
        public Node bodyNode;

        public WhileNode(Token token, Node conditionNode, Node bodyNode)
        {
            this.token = token;
            this.conditionNode = conditionNode;
            this.bodyNode = bodyNode;
        }
    }

    public class FunctionDefNode
    {
        public Token token;
        public Token varNameToken;
        public List<Token> argNameTokens;
        public Node bodyNode;

        public FunctionDefNode(Token token, Token varNameToken, List<Token> argNameTokens, Node bodyNode)
        {
            this.token = token;
            this.varNameToken = varNameToken;
            this.argNameTokens = argNameTokens;
            this.bodyNode = bodyNode;
        }
    }

    public class CallNode
    {
        public Token token;
        public Node nodeToCall;
        public List<Node> argNodes;

        public CallNode(Token token, Node nodeToCall, List<Node> argNodes)
        {
            this.token = token;
            this.nodeToCall = nodeToCall;
            this.argNodes = argNodes;
        }
    }

    public class ReturnNode
    {
        public Token token;
        public Node node;

        public ReturnNode(Token token, Node node)
        {
            this.token = token;
            this.node = node;
        }
    }

    public class BreakNode
    {
        public Token token;

        public BreakNode(Token token)
        {
            this.token = token;
        }
    }

    public class ContinueNode
    {
        public Token token;

        public ContinueNode(Token token)
        {
            this.token = token;
        }
    }

    // PARSE RESULT

    public class ParseResult
    {
        public Node node;
        public Error error;
        public int AdvanceCount;
        public int LastAdvanceCount;
        public int To_reverseCount;

        public void RegisterAdvancement()
        {
            LastAdvanceCount = 1;
            AdvanceCount++;
        }
    }
}