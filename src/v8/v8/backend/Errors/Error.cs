using v8.backend.lexer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace v8.backend.Errors
{
    public class Error
    {
        public string type;
        public string details;
        public string code;
        public int PosStart;
        public int PosEnd;
        public Token token;

        public Error(string type, string details, string code, int PosStart, int PosEnd, Token token)
        {
            this.type = type;
            this.details = details;
            this.code = code;
            this.PosStart = PosStart;
            this.PosEnd = PosEnd;
            this.token = token;
        }
    }
}