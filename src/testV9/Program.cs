using testV9.tokenizer;

namespace testV9
{
    internal class Program
    {
        static void Main(string[] args)
        {
            var scanner = new Scanner("1+1");
            var tokens = scanner.ScanTokens();

            foreach (var token in tokens)
            {
                System.Console.WriteLine(token.Type);
            }

            System.Console.ReadLine();
        }
    }
}