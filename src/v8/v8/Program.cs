using v8.backend.Errors;
using v8.backend.lexer;
using v8.backend.lexer.types;
using System.Collections.Generic;

namespace v8
{
    public class Program
    {
        static void Main(string[] args)
        {
            Tokenizer tok = new("var a = 5;?", "file.dyd");

            List<Token> tokens = tok.Tokenize();

            foreach (Token token in tokens)
            {
                System.Console.WriteLine(token.type + " " + token.value);
            }
        }
    }

}