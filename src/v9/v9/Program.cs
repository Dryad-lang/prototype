using v9.lexer;

Lexer lex = new Lexer("\"This is a string\"");

List<Token> tokens = new List<Token>();

tokens = lex.GetTokens();

foreach (Token token in tokens)
{
    Console.WriteLine(token.Value + " " + token.Type);
}