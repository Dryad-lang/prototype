using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace testV9.tokenizer
{
    public enum TokenTypes
    {
        // LITERALS
        IDENTIFYER, NUMBER, STRING,
        
        // OPERATORS
        ASSING_OP, PLUS_OP, MINUS_OP, 
        MULTIPLY_OP, DIVIDE_OP,

        // SEPARATORS
        PAREN_OPEN, PAREN_CLOSE, SEMICOLON,

        // ESPECIAL
        EOF
    }
    
    public class Token
    {
        
    }

    public class tokenizer
    {
        
    }
}