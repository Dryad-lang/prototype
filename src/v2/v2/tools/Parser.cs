using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using v2.objects;

namespace v2.tools
{
    public class Parser
    {
        private List<Token> tokens;
        private int currentTokenIndex = 1;

        public Parser(List<Token> tokens)
        {
            this.tokens = tokens;
        }

    }
}