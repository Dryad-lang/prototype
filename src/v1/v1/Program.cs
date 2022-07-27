using v1.Back;

namespace v1
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Lexer lexer = new Lexer();
            List<Token> tokens = new();
            
            string? input;
            while (true)
            {
                Console.Write(">> ");
                input = Console.ReadLine();
                if (input == "exit")
                {
                    break;
                }
                else
                {
                    try
                    {
                        lexer.AddRawText(input == null ? "" : input);
                        tokens = lexer.Tokenize();
                        foreach (var token in tokens)
                        {
                            Console.WriteLine($"Type:{token.Type} Value:{token.Value}");
                        }
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine("Error: " + e.Message);
                    }
                }
            }
        }
    }
}