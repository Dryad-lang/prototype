using testV5;

string source = "1+1";
Scanner scanner = new Scanner(source);
List<Token> tokens = scanner.ScanTokens();
foreach (Token token in tokens)
{
Console.WriteLine(token);
}