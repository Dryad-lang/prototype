using v8.backend.Errors;
using v8.backend.lexer;
using v8.backend.lexer.types;

namespace v8
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Tokenizer tok = new("string i = \"Ch\\naR\"; \n", "index.dyd");

            List<Token> list = new List<Token>();

            list = tok.Tokenize();

            Console.WriteLine(list);
        }
    }
}