using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using v8.backend.lexer;

namespace v8.backend.lexer
{
    /*
    This is the tokenizer for math expresions 
    What can be math expressions?
    1. Numbers
    2. Math operators
    */ 
    internal class MOpDictionay
    {
        private Dictionary<string, string> dictionary;

        public MOpDictionay()
        {
            this.dictionary = new Dictionary<string, string>();
            this.dictionary.Add("+", "OP_PLUS");
            this.dictionary.Add("-", "OP_MINUS");
            this.dictionary.Add("*", "OP_MULT");
            this.dictionary.Add("/", "OP_DIV");
            this.dictionary.Add("%", "OP_MOD");
            this.dictionary.Add("^", "OP_POW");
        }
        
        public bool Contains(string key)
        {
            return this.dictionary.ContainsKey(key);
        }

        public string Get(string key)
        {
            return this.dictionary[key];
        }
    }

    public class MakeNumber 
    {

    }

    public class MTokeizer : ITokenizer
    {
        public Token Match(string input)
        {
            throw new NotImplementedException();
        }
    }
}
