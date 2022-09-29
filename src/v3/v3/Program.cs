using v3.back;
using v3.back.objects;
using v3.front;
namespace v3
{
    internal class Program
    {
        static void Main(string[] args)
        {
            if(args.Length == 0)
            {
                string? imput = "";
                Console.WriteLine("Welcome to the dryad v3.0!");
                Console.WriteLine("Type 'exit' to exit.");
                while(true)
                {
                    Console.Write(">> ");
                    imput = Console.ReadLine();
                    if(imput == "exit")
                    {
                        break;
                    }
                    else if(!string.IsNullOrEmpty(imput))
                    {
                        Tokenizer tokenizer = new Tokenizer();
                        List<Token> tokens = tokenizer.Tokenize(imput);
                        foreach (Token token in tokens)
                        {
                            Console.WriteLine($"Type: {token.Type} Value: {token.Char} [L: {token.Info?.line} C: {token.Info?.colum} P: {token.Info?.position}]");
                        }
                    }
                }
            }
            else
            {
                FileReader fileReader = new FileReader();
                string? rawtext = fileReader.ReadFile(args[0]);
                if(!string.IsNullOrEmpty(rawtext))
                {
                    Tokenizer tokenizer = new Tokenizer();
                    List<Token> tokens = tokenizer.Tokenize(rawtext);
                    foreach (Token token in tokens)
                    {
                        Console.WriteLine($"Type: {token.Type} Value: {token.Char} [L: {token.Info?.line} C: {token.Info?.colum} P: {token.Info?.position}]");
                    }
                }
            }
        }
    }
}