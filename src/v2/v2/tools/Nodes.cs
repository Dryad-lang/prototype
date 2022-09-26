using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using v2.objects;

namespace v2.tools
{
    /*
    Namespace for the nodes that are used in the AST.

    Rules for the nodes:

    1. All nodes must inherit from Node.
    2. All nodes must have a constructor that takes a Token as a parameter.
    3. All nodes need to have a index number that is used to identify the node and used 
       for walking trough the tree.

    Working 

    - First take all the tokens and and 

    - Then create a tree of nodes
        Rules for the tree:
            - Terms for left nodes (terms: + -)
            - Numbers for left if there is no term (terms: + -) if there is a term then it is a right node
            - Factors for right nodes (factors: * /)
            - If the token is a LPAREN then ignore parentesis and create a new tree and do the 
                tree process for all token until the RPAREN is found.

    - Then evaluate the tree
        - If the tree have elements that not follow the rules then throw an error
        - If the tree is correct then evaluate it
    
    - Then return the tree object

    */


    public class Node
    {
        public Token? token { get; set; }
        public Node? left { get; set; }
        public Node? right { get; set; }
        public int index { get; set; }
    }
    
    public class TreeRules
    {
        public string Rule(Token token)
        {
            if (token.type == "TPlus" || token.type == "TMinus")
            {
                return "term";
            }
            else if (token.type == "TNumber")
            {
                return "number";
            }
            else if (token.type == "TMultiply" || token.type == "TDivide")
            {
                return "factor";
            }
            else if (token.type == "TLParen")
            {
                return "lparen";
            }
            else if (token.type == "TRParen")
            {
                return "rparen";
            }
            else
            {
                return "unknown";
            }
        }
    }

    public class Tree
    {
        public int currentTokenIndex { get; set; }

        public Node? root { get; set; }

        public void Insert(Token token)
        {
            if (root == null)
            {
                root = new Node();
                root.token = token;
                root.index = 0;
            }
        }
    }
}