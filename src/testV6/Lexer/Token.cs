using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace testV6.Lexer
{
    public class Token
    {
        public string Lexme { get; set; }
        public int Line { get; set; }
        public object Literal { get; set; }
        public TokenTypes Type { get; set; }

        public Token(TokenTypes type, string lexme, object literal, int line)
        {
            this.Type = type;
            this.Lexme = lexme;
            this.Literal = literal;
            this.Line = line;
        }

        public override string ToString()
        {
            return this.Type + " " + this.Lexme + " " + this.Literal;
        }
    }
}
