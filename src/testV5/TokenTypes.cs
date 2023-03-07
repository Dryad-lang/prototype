using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace testV5
{
    public enum TokenTypes
    {
        // Operators
        OP_ADD, OP_MUL, OP_DIV, OP_SUB,
        OP_ASG,
        
        // Seprators
        COMA, LPAREN, RPAREN, RBRACK, LBRACK,
        
        // Literals
        NUMBER, IDENTIFYER, STRING,

        // Keywords
        FUNCTION, LET, RETURN,
        
        // SPECIAL
        EOF
    }
}
