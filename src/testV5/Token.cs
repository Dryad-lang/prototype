using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace testV5
{
    public class Token
    {
        public TokenTypes type { get; set; }
        public string literal { get; set; }
        
        public Token(TokenTypes _type, string _literal)
        {
            type = _type;
            literal = _literal;
        }

        public override string ToString()
        {
            return type + " " + literal;
        }
    }
}
