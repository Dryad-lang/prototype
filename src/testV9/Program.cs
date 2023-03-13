using testV9.tokenizer;

namespace testV9
{
    internal class Program
    {
        static void Main(string[] args)
        {
            var scanner = new Scanner("\"Changes\"");
            var tokens = scanner.ScanTokens();

            foreach (var token in tokens)
            {
                System.Console.WriteLine(token.Type);
            }

            System.Console.ReadLine();
        }
    }
}