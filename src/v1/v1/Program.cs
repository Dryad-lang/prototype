using v1.Back;

namespace v1
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Lexer lexer = new Lexer();
            List<Token> tokens = new();

            string input = new("");
            while (true)
            {
                Console.Write(">> ");
                input = Console.ReadLine();
                if (input == "exit")
                {
                    break;
                }
                else if (input == "clear")
                {
                    Console.Clear();
                }
                /*
                Read files with extension .dyd -> Dryad
                Command to read file: dryad name.dyd
                */
                else if(input.StartsWith("dryad"))
                {
                    string[] split = input.Split(" ");
                    if(split.Length == 2)
                    {
                        string path = split[1];
                        if(File.Exists(path))
                        {
                            string text = File.ReadAllText(path);
                            lexer.AddRawText(text == null ? "" : text);
                            tokens = lexer.Tokenize();
                            foreach (Token token in tokens)
                            {
                                Console.WriteLine($"Type:{token.Type} Value:{token.Value}");
                            }
                        }
                        else
                        {
                            Console.WriteLine("File not found");
                        }
                    }
                    else
                    {
                        Console.WriteLine("Invalid command");
                    }
                }
                else if (! string.IsNullOrEmpty(input))
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