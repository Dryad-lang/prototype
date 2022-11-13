using System.Collections.Generic;
using System;
using System.Text;

/*

internal types:
    - int (32 bit) 0-9  INTEGER
    - float (32 bit) 0.0-9.9    FLOAT
    - string   "hello"  STRING
    - bool    true/false    BOOL
    - char  'a' CHAR
    - void  void    VOID

keywords:
    - for   for (int i = 0; i < 10; i++)   FOR_LOOP
    - while  while (true)   WHILE_LOOP
    - if    if (true)   IF_STATEMENT
    - else  else    ELSE_STATEMENT
    - return  return 0;  RETURN_STATEMENT
    - break break;  BREAK_STATEMENT
    - continue  continue;   CONTINUE_STATEMENT
    - switch    switch (i)  SWITCH_STATEMENT
    - case  case 0: CASE_STATEMENT
    - default   default:    DEFAULT_STATEMENT
    - function  void main(){}   FUNCTION_DEFINITION

operators:
    Math:
    - +     1 + 1  MATH_OPERATOR_ADD
    - -     1 - 1  MATH_OPERATOR_SUBTRACT
    - *     1 * 1  MATH_OPERATOR_MULTIPLY
    - /     1 / 1  MATH_OPERATOR_DIVIDE
    - %     1 % 1  MATH_OPERATOR_MODULO
    Assignment operator:
    - =    int i = 0;    ASSIGNMENT_OPERATOR
    Comparison operators:
    - ==    1 == 1    COMPARISON_OPERATOR_EQUAL
    - !=    1 != 1    COMPARISON_OPERATOR_NOT_EQUAL
    - >     1 > 1 COMPARISON_OPERATOR_GREATER_THAN
    - <     1 < 1 COMPARISON_OPERATOR_LESS_THAN
    - >=    1 >= 1    COMPARISON_OPERATOR_GREATER_THAN_OR_EQUAL
    - <=    1 <= 1    COMPARISON_OPERATOR_LESS_THAN_OR_EQUAL
    Logical operators:
    - !     !true LOGICAL_OPERATOR_NOT
    - &&    true && true   LOGICAL_OPERATOR_AND
    - ||    true || true   LOGICAL_OPERATOR_OR
    Increment and decrement
    - ++    i++    INCREMENT_OPERATOR
    - --    i--    DECREMENT_OPERATOR
    Asignments:
    - +=    i += 1  ASSIGNMENT_OPERATOR_ADD
    - -=    i -= 1  ASSIGNMENT_OPERATOR_SUBTRACT
    - *=    i *= 1  ASSIGNMENT_OPERATOR_MULTIPLY
    - /=    i /= 1  ASSIGNMENT_OPERATOR_DIVIDE    

Special chars:
    - (     (   LEFT_PARENTHESIS
    - )     )   RIGHT_PARENTHESIS
    - {     {   LEFT_BRACE
    - }     }   RIGHT_BRACE
    - [     [   LEFT_BRACKET
    - ]     ]   RIGHT_BRACKET
    - ,     ,   COMMA
    - ;     ;   SEMICOLON
    - .     .   DOT

Identifyers: 
    - [a-zA-Z_][a-zA-Z0-9_]*    IDENTIFYER

    Indentifyers are considered to be keywords if they dont match any keywords or types
    operators are´nt considered to be keywords  or types or identifyers because they are
    symbols and not words or numbers and numbers need to be caught by the lexer first than 
    identifyers because numbers are also used as identifyers and if they caught as identifyers
    cant generate a number

    Identifyer rules:
    - cant start with a number -> Because numbers are lexed first for dont be confused with identifyers
    - cant start with a symbol -> Symbols dont have any meaning and are not words and if used 
    operators symbols they are caught as operators and not as identifyers
    


*/
namespace v6
{
    public class TokenTypes
    {
        Dictionary<string, string> tokenTypes = new Dictionary<string, string>();

        public TokenTypes()
        {
            // tokenTypes.Add("INTEGER", "int");
            // tokenTypes.Add("FLOAT", "float");
            // tokenTypes.Add("STRING", "string");
            // tokenTypes.Add("BOOL", "bool");
            // tokenTypes.Add("CHAR", "char");
            // tokenTypes.Add("VOID", "void");
            // tokenTypes.Add("FOR_LOOP", "for");
            // tokenTypes.Add("WHILE_LOOP", "while");
            // tokenTypes.Add("IF_STATEMENT", "if");
            // tokenTypes.Add("ELSE_STATEMENT", "else");
            // tokenTypes.Add("RETURN_STATEMENT", "return");
            // tokenTypes.Add("BREAK_STATEMENT", "break");
            // tokenTypes.Add("CONTINUE_STATEMENT", "continue");
            // tokenTypes.Add("SWITCH_STATEMENT", "switch");
            // tokenTypes.Add("CASE_STATEMENT", "case");
            // tokenTypes.Add("DEFAULT_STATEMENT", "default");
            // tokenTypes.Add("FUNCTION_DEFINITION", "function");
            // tokenTypes.Add("MATH_OPERATOR_ADD", "+");
            // tokenTypes.Add("MATH_OPERATOR_SUBTRACT", "-");
            // tokenTypes.Add("MATH_OPERATOR_MULTIPLY", "*");
            // tokenTypes.Add("MATH_OPERATOR_DIVIDE", "/");
            // tokenTypes.Add("MATH_OPERATOR_MODULO", "%");
            // tokenTypes.Add("ASSIGNMENT_OPERATOR", "=");
            // tokenTypes.Add("COMPARISON_OPERATOR_EQUAL", "==");
            // tokenTypes.Add("COMPARISON_OPERATOR_NOT_EQUAL", "!=");
            // tokenTypes.Add("COMPARISON_OPERATOR_GREATER_THAN", ">");
            // tokenTypes.Add("COMPARISON_OPERATOR_LESS_THAN", "<");
            // tokenTypes.Add("COMPARISON_OPERATOR_GREATER_THAN_OR_EQUAL", ">=");
            // tokenTypes.Add("COMPARISON_OPERATOR_LESS_THAN_OR_EQUAL", "<=");
            // tokenTypes.Add("LOGICAL_OPERATOR_NOT", "!");
            // tokenTypes.Add("LOGICAL_OPERATOR_AND", "&&");
            // tokenTypes.Add("LOGICAL_OPERATOR_OR", "||");
            // tokenTypes.Add("INCREMENT_OPERATOR", "++");
            // tokenTypes.Add("DECREMENT_OPERATOR", "--");
            // tokenTypes.Add("ASSIGNMENT_OPERATOR_ADD", "+=");
            // tokenTypes.Add("ASSIGNMENT_OPERATOR_SUBTRACT", "-=");
            // tokenTypes.Add("ASSIGNMENT_OPERATOR_MULTIPLY", "*=");
            // tokenTypes.Add("ASSIGNMENT_OPERATOR_DIVIDE", "/=");
            // tokenTypes.Add("LEFT_PARENTHESIS", "(");
            // tokenTypes.Add("RIGHT_PARENTHESIS", ")");
            // tokenTypes.Add("LEFT_BRACE", "{");
            // tokenTypes.Add("RIGHT_BRACE", "}");
            // tokenTypes.Add("LEFT_BRACKET", "[");
            // tokenTypes.Add("RIGHT_BRACKET", "]");
            // tokenTypes.Add("COMMA", ",");
            // tokenTypes.Add("SEMICOLON", ";");
            // tokenTypes.Add("DOT", ".");

            //Change the key by valye
            tokenTypes.Add("int", "INTEGER");
            tokenTypes.Add("float", "FLOAT");
            tokenTypes.Add("string", "STRING");
            tokenTypes.Add("bool", "BOOL");
            tokenTypes.Add("char", "CHAR");
            tokenTypes.Add("void", "VOID");
            tokenTypes.Add("for", "FOR_LOOP");
            tokenTypes.Add("while", "WHILE_LOOP");
            tokenTypes.Add("if", "IF_STATEMENT");
            tokenTypes.Add("else", "ELSE_STATEMENT");
            tokenTypes.Add("return", "RETURN_STATEMENT");
            tokenTypes.Add("break", "BREAK_STATEMENT");
            tokenTypes.Add("continue", "CONTINUE_STATEMENT");
            tokenTypes.Add("switch", "SWITCH_STATEMENT");
            tokenTypes.Add("case", "CASE_STATEMENT");
            tokenTypes.Add("default", "DEFAULT_STATEMENT");
            tokenTypes.Add("function", "FUNCTION_DEFINITION");
            tokenTypes.Add("+", "MATH_OPERATOR_ADD");
            tokenTypes.Add("-", "MATH_OPERATOR_SUBTRACT");
            tokenTypes.Add("*", "MATH_OPERATOR_MULTIPLY");
            tokenTypes.Add("/", "MATH_OPERATOR_DIVIDE");
            tokenTypes.Add("%", "MATH_OPERATOR_MODULO");
            tokenTypes.Add("=", "ASSIGNMENT_OPERATOR");
            tokenTypes.Add("==", "COMPARISON_OPERATOR_EQUAL");
            tokenTypes.Add("!=", "COMPARISON_OPERATOR_NOT_EQUAL");
            tokenTypes.Add(">", "COMPARISON_OPERATOR_GREATER_THAN");
            tokenTypes.Add("<", "COMPARISON_OPERATOR_LESS_THAN");
            tokenTypes.Add(">=", "COMPARISON_OPERATOR_GREATER_THAN_OR_EQUAL");
            tokenTypes.Add("<=", "COMPARISON_OPERATOR_LESS_THAN_OR_EQUAL");
            tokenTypes.Add("!", "LOGICAL_OPERATOR_NOT");
            tokenTypes.Add("&&", "LOGICAL_OPERATOR_AND");
            tokenTypes.Add("||", "LOGICAL_OPERATOR_OR");
            tokenTypes.Add("++", "INCREMENT_OPERATOR");
            tokenTypes.Add("--", "DECREMENT_OPERATOR");
            tokenTypes.Add("+=", "ASSIGNMENT_OPERATOR_ADD");
            tokenTypes.Add("-=", "ASSIGNMENT_OPERATOR_SUBTRACT");
            tokenTypes.Add("*=", "ASSIGNMENT_OPERATOR_MULTIPLY");
            tokenTypes.Add("/=", "ASSIGNMENT_OPERATOR_DIVIDE");
            tokenTypes.Add("(", "LEFT_PARENTHESIS");
            tokenTypes.Add(")", "RIGHT_PARENTHESIS");
            tokenTypes.Add("{", "LEFT_BRACE");
            tokenTypes.Add("}", "RIGHT_BRACE");
            tokenTypes.Add("[", "LEFT_BRACKET");
            tokenTypes.Add("]", "RIGHT_BRACKET");
            tokenTypes.Add(",", "COMMA");
            tokenTypes.Add(";", "SEMICOLON");
            tokenTypes.Add(".", "DOT");


        }

        public string GetTokenType(string token)
        {
            if (tokenTypes.ContainsKey(token.ToLower()))
            {
                return tokenTypes[token.ToLower()];
            }
            else
            {
                return "IDENTIFYER";
            }
        }
    }

    public class Token
    {
        public string type;
        public string value;
        public int line;
        public int column;
        public int index;

        public Token(string type, string value, int line, int column, int index)
        {
            this.type = type;
            this.value = value;
            this.line = line;
            this.column = column;
            this.index = index;
        }
    }


    public class Lexer
    {
        public List<Token> tokens = new List<Token>();
        public TokenTypes tokenTypes = new TokenTypes();

        public int line = 1;
        public int column = 0;
        public int index = 0;
        public string code;
        public char currentChar;
        public string currentToken = "";

        /*
        
        How the lexer works:
        - The lexer reads the code char by char
        - Every char is added to the current token
        - Every time verify if the current token is a valid token
        if is a type or keyword or operator or identifyer or number or string or special charater
        - If the current token is a valid token add it to the tokens list and reset the current token
        - If the current token dont match any valid token trow an error

        */

        public Lexer(string code)
        {
            this.code = code;
            currentChar = code[index];
        }

        public void Advance()
        {
            index++;
            if (index < code.Length)
            {
                currentChar = code[index];
            }
            else
            {
                currentChar = '\0';
            }
        }

        public char Peek()
        {
            if (index + 1 < code.Length)
            {
                return code[index + 1];
            }
            else
            {
                return '\0';
            }
        }

        public void SkipWhitespace()
        {
            while (currentChar != '\0' && (currentChar == ' ' || currentChar == '\t' || currentChar == '\n'))
            {
                if (currentChar == '\n')
                {
                    line++;
                    column = 0;
                }
                Advance();
            }
        }

        public void SkipComment()
        {
            // Skip line comment
            if (currentChar == '/' && Peek() == '/')
            {
                while (currentChar != '\0' && currentChar != '\n')
                {
                    Advance();
                }
            }

            // Skip block comment
            if (currentChar == '/' && Peek() == '*')
            {
                while (currentChar != '\0' && (currentChar != '*' && Peek() != '/'))
                {
                    Advance();
                }
                Advance();
                Advance();
                Advance();
                Advance();
            }
        }

        public void JumpLine()
        {
            while (currentChar != '\0' && currentChar != '\n')
            {
                Advance();
            }
        }

        public void AddToken(string tokenType)
        {
            tokens.Add(new Token(tokenType, currentToken, line, column, index));
            currentToken = "";
        }

        public Token MakeNumber()
        {
            int dotCount = 0;
            while (currentChar != '\0' && (char.IsDigit(currentChar) || currentChar == '.'))
            {
                if (currentChar == '.')
                {
                    dotCount++;
                }
                currentToken += currentChar;
                Advance();
            }

            if (dotCount > 1)
            {
                throw new Exception("Invalid number");
            }

            if (dotCount == 1)
            {
                return new Token("FLOAT", currentToken, line, column, index);
            }
            else
            {
                return new Token("INTEGER", currentToken, line, column, index);
            }
        }

        public Token MakeString()
        {
            string str = "";
            Advance();
            while (currentChar != '\0' && currentChar != '"')
            {
                str += currentChar;
                Advance();
            }
            Advance();
            return new Token("STRING", str, line, column, index);
        }

        public Token MakeIdentifyer()
        {
            while (currentChar != '\0' && (char.IsLetterOrDigit(currentChar) || currentChar == '_'))
            {
                currentToken += currentChar;
                Advance();
            }
            return new Token(tokenTypes.GetTokenType(currentToken), currentToken, line, column, index);
        }

        public List<Token> MakeTokens()
        {
            while (currentChar != '\0')
            {
                if (currentChar == ' ' || currentChar == '\t' || currentChar == '\n')
                {
                    SkipWhitespace();
                    continue;
                }

                if (currentChar == '\r' || currentChar == '\n')
                {
                    JumpLine();
                    continue;
                }

                if (currentChar == '/' && (Peek() == '/' || Peek() == '*'))
                {
                    SkipComment();
                    continue;
                }

                if (char.IsDigit(currentChar))
                {
                    tokens.Add(MakeNumber());
                    currentToken = "";
                    continue;
                }

                if (currentChar == '"')
                {
                    tokens.Add(MakeString());
                    currentToken = "";
                    continue;
                }

                if (char.IsLetter(currentChar))
                {
                    tokens.Add(MakeIdentifyer());
                    currentToken = "";
                    continue;
                }

                if (currentChar == '=' && Peek() == '=')
                {
                    currentToken += currentChar;
                    Advance();
                    currentToken += currentChar;
                    Advance();
                    AddToken("COMPARISON_OPERATOR_EQUAL");
                    continue;
                }

                if (currentChar == '!' && Peek() == '=')
                {
                    currentToken += currentChar;
                    Advance();
                    currentToken += currentChar;
                    Advance();
                    AddToken("COMPARISON_OPERATOR_NOT_EQUAL");
                    continue;
                }

                if (currentChar == '>' && Peek() == '=')
                {
                    currentToken += currentChar;
                    Advance();
                    currentToken += currentChar;
                    Advance();
                    AddToken("COMPARISON_OPERATOR_GREATER_THAN_OR_EQUAL");
                    continue;
                }

                if (currentChar == '<' && Peek() == '=')
                {
                    currentToken += currentChar;
                    Advance();
                    currentToken += currentChar;
                    Advance();
                    AddToken("COMPARISON_OPERATOR_LESS_THAN_OR_EQUAL");
                    continue;
                }

                if (currentChar == '+' && Peek() == '=')
                {
                    currentToken += currentChar;
                    Advance();
                    currentToken += currentChar;
                    Advance();
                    AddToken("ASSIGNMENT_OPERATOR_ADD");
                    continue;
                }

                if (currentChar == '-' && Peek() == '=')
                {
                    currentToken += currentChar;
                    Advance();
                    currentToken += currentChar;
                    Advance();
                    AddToken("ASSIGNMENT_OPERATOR_SUBTRACT");
                    continue;
                }

                if (currentChar == '*' && Peek() == '=')
                {
                    currentToken += currentChar;
                    Advance();
                    currentToken += currentChar;
                    Advance();
                    AddToken("ASSIGNMENT_OPERATOR_MULTIPLY");
                    continue;
                }

                if (currentChar == '/' && Peek() == '=')
                {
                    currentToken += currentChar;
                    Advance();
                    currentToken += currentChar;
                    Advance();
                    AddToken("ASSIGNMENT_OPERATOR_DIVIDE");
                    continue;
                }

                if (currentChar == '%' && Peek() == '=')
                {
                    currentToken += currentChar;
                    Advance();
                    currentToken += currentChar;
                    Advance();
                    AddToken("ASSIGNMENT_OPERATOR_MODULO");
                    continue;
                }

                if (currentChar == '+' && Peek() == '+')
                {
                    currentToken += currentChar;
                    Advance();
                    currentToken += currentChar;
                    Advance();
                    AddToken("INCREMENT_OPERATOR");
                    continue;
                }

                if (currentChar == '-' && Peek() == '-')
                {
                    currentToken += currentChar;
                    Advance();
                    currentToken += currentChar;
                    Advance();
                    AddToken("DECREMENT_OPERATOR");
                    continue;
                }

                if (currentChar == '=')
                {
                    currentToken += currentChar;
                    Advance();
                    AddToken("ASSIGNMENT_OPERATOR");
                    continue;
                }

                if (currentChar == '+')
                {
                    currentToken += currentChar;
                    Advance();
                    AddToken("ARITHMETIC_OPERATOR_ADD");
                    continue;
                }

                if (currentChar == '-')
                {
                    currentToken += currentChar;
                    Advance();
                    AddToken("ARITHMETIC_OPERATOR_SUBTRACT");
                    continue;
                }

                if (currentChar == '*')
                {
                    currentToken += currentChar;
                    Advance();
                    AddToken("ARITHMETIC_OPERATOR_MULTIPLY");
                    continue;
                }

                if (currentChar == '/')
                {
                    currentToken += currentChar;
                    Advance();
                    AddToken("ARITHMETIC_OPERATOR_DIVIDE");
                    continue;
                }

                if (currentChar == '%')
                {
                    currentToken += currentChar;
                    Advance();
                    AddToken("ARITHMETIC_OPERATOR_MODULO");
                    continue;
                }

                if (currentChar == '>')
                {
                    currentToken += currentChar;
                    Advance();
                    AddToken("COMPARISON_OPERATOR_GREATER_THAN");
                    continue;
                }

                if (currentChar == '<')
                {
                    currentToken += currentChar;
                    Advance();
                    AddToken("COMPARISON_OPERATOR_LESS_THAN");
                    continue;
                }

                if (currentChar == '!')
                {
                    currentToken += currentChar;
                    Advance();
                    AddToken("COMPARISON_OPERATOR_NOT");
                    continue;
                }

                if (currentChar == '&')
                {
                    currentToken += currentChar;
                    Advance();
                    AddToken("LOGICAL_OPERATOR_AND");
                    continue;
                }

                if (currentChar == '|')
                {
                    currentToken += currentChar;
                    Advance();
                    AddToken("LOGICAL_OPERATOR_OR");
                    continue;
                }

                if (currentChar == '(')
                {
                    currentToken += currentChar;
                    Advance();
                    AddToken("LEFT_PARENTHESIS");
                    continue;
                }

                if (currentChar == ')')
                {
                    currentToken += currentChar;
                    Advance();
                    AddToken("RIGHT_PARENTHESIS");
                    continue;
                }

                if (currentChar == '{')
                {
                    currentToken += currentChar;
                    Advance();
                    AddToken("LEFT_BRACE");
                    continue;
                }

                if (currentChar == '}')
                {
                    currentToken += currentChar;
                    Advance();
                    AddToken("RIGHT_BRACE");
                    continue;
                }

                if (currentChar == '[')
                {
                    currentToken += currentChar;
                    Advance();
                    AddToken("LEFT_BRACKET");
                    continue;
                }

                if (currentChar == ']')
                {
                    currentToken += currentChar;
                    Advance();
                    AddToken("RIGHT_BRACKET");
                    continue;
                }

                if (currentChar == ',')
                {
                    currentToken += currentChar;
                    Advance();
                    AddToken("COMMA");
                    continue;
                }

                if (currentChar == ';')
                {
                    currentToken += currentChar;
                    Advance();
                    AddToken("SEMICOLON");
                    continue;
                }

                if (currentChar == '.')
                {
                    currentToken += currentChar;
                    Advance();
                    AddToken("DOT");
                    continue;
                }

                else
                {
                    Console.WriteLine($"Error: Unexpected character '{currentChar}' at line {line}.");
                    throw new Exception();
                }
            }
            return tokens;
        }
    }
}