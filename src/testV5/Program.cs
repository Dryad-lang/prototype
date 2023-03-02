using testV5.Lexer;

Scanner scanner = new Scanner("let i = 1;");
List<Token> tokens = scanner.ScanTokens();

foreach (Token token in tokens)
{
    Console.WriteLine(token);
}
