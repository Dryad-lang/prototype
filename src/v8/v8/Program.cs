using v8.backend.Errors;
using v8.backend.lexer;
using v8.backend.lexer.types;

namespace v8
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Tokenizer tok = new("2..2", "index.dyd");

            List<Token> list = new List<Token>();

            try
            {
                list = tok.Tokenize();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
            foreach (var token in list)
            {
                Console.WriteLine(token.type + " " + token.value);
            }            
        }
    }
}