using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using v8.backend.lexer;
using v8.backend.lexer.types;
using v8.backend.Errors;

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
        public static Token Make(Token input)
        {
            Integer intVal = new Integer(input.value);
            Float floatVal = new Float(input.value);

            if(intVal.Rule(input.value)){
                return new Token("INTEGER", input.value, input.index, input.colum, input.line, input.PosStart, input.PosEnd, input.file, input.lineData, input.group);                 
            }
            if(floatVal.Rule(input.value)){
                // Validate float
                string number = "";
                int dots = 0;

                for (int i = 0; i < input.value.Length; i++)
                {
                    if (input.value[i] == '.')
                    {
                        dots++;
                        if (dots > 1)
                        {
                            Traceback trace = new Traceback();
                            trace.AddError(new InvalidNumberError(input));
                            trace.Throw();            
                        }
                        else
                        {
                            number += input.value[i];
                        }
                    }
                    else
                    {
                        number += input.value[i];
                    }
                }

                return new Token("FLOAT", number, input.index, input.colum, input.line, input.PosStart, input.PosEnd, input.file, input.lineData, input.group);
            }
            return new Token("NaN", "NaN", input.index, input.colum, input.line, input.PosStart, input.PosEnd, input.file, input.lineData, input.group);
        }

    }

    public class MTokeizer : ITokenizer
    {
        public Token Match(string input)
        {
            throw new NotImplementedException();
        }
    }
}
