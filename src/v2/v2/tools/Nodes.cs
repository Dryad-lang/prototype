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

    Working 

    - First take all the tokens and and 

    - Then create a tree of nodes
        Rules for the tree:
            - Terms for left nodes (terms: + -)
            - Numbers for left if there is no term (terms: + -) if there is a term then it is a right node
            - Factors for right nodes (factors: * /)

    - Then evaluate the tree
        - If the tree have elements that not follow the rules then throw an error
        - If the tree is correct then evaluate it
    
    

    */
}