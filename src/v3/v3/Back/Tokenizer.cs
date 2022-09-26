using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using v3.back.objects;

namespace v3.back
{
    public class Tokenizer
    {
        private List<Token> _tokens = new List<Token>();
        private InternalTypes _internalTypes = new InternalTypes(); 
        public List<Token> Tokenizer(string rawtext)
        {
            private int _line = 1;
            private int _column = 1;
            private int _index = 0;
            private string cursor = rawtext[_index];
        }
    }
}