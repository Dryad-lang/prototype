using testV6.Lexer;

var scanner = new Scanner(
    "let i = 1;"
);
List<Token> tokens = scanner.ScanTokens();

foreach (var token in tokens)
{
    Console.WriteLine(token);
}