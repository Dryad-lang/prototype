using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using v8.backend.lexer;
using System.Text.RegularExpressions;
using v8.backend.lexer.types;
using v8.backend.Errors;
using v8.backend.analyzer;

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

    public class MakeNumber : MTokeizer
    {
        public static Token Make(Token input, SourceCode src)
        {
            Integer intVal = new Integer(input.value);
            Float floatVal = new Float(input.value);

            if(intVal.Rule(input.value)){
                return new Token(Types.Integer, input.value, input.index, input.colum, input.line, input.PosStart, input.PosEnd, input.file, input.group);                 
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
                            trace.AddError(new InvalidNumberError(input, src));
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

                return new Token(Types.FLOAT_TYPE, number, input.index, input.colum, input.line, input.PosStart, input.PosEnd, input.file, input.group);
            }
            return new Token(Types.NOTANUMBER_TYPE, "NaN", input.index, input.colum, input.line, input.PosStart, input.PosEnd, input.file, input.group);
        }

    }

    public class MTokeizer : ITokenizer
    {
        private MOpDictionay opDictionary = new();
        SourceCode src;

        public MTokeizer()
        {
            this.src = new SourceCode("");
        }

        public Token Match(string input)
        {
            
        }
    }
}
