using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using v2.objects;

namespace v2.tools
{
    public class Tokenizer
    {
        private char current;
        private char cursor;
        private string rawtext;
        
        private Info info = new();
        private List<Token> tokens = new();

        
        public Tokenizer(string textInput)
        {
            info.SetLine(1);
            info.SetColum(1);
            info.SetPosition(0);
            rawtext = textInput;
        }
        
        public List<Token> Tokenize()
        {
            while (info.position < rawtext.Length)
            {
                current = rawtext[info.position];
                cursor = rawtext[info.position + 1];
                if (current == ' ')
                {
                    info.IncrementColum();
                    info.IncrementPosition();
                }
                else if (current == '
    }
}
