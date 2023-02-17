using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using v8.backend.analyzer;
using v8.backend.Errors;
using v8.backend.lexer.types;
using v8.backend.lexer;
using System.Text.RegularExpressions;

namespace v8.backend.lexer.types
{

    public enum Types
    {
        MathOP_PLUS,
        MathOP_MINUS,
        MathOP_MULT,
        MathOP_DIV,
        MathOP_MOD,
        MathOP_POW,
        OP_INC,
        OP_DEC,
        OP_ASSIGN,
        OP_ASSIGN_PLUS,
        OP_ASSIGN_MINUS,
        OP_ASSIGN_MULT,
        OP_ASSIGN_DIV,
        OP_ASSIGN_MOD,
        OP_ASSIGN_POW,
        OP_EQUAL,
        OP_NOT_EQUAL,
        OP_GREATER,
        OP_LESS,
        OP_GREATER_EQUAL,
        OP_LESS_EQUAL,
        OP_AND,
        OP_OR,
        OP_NOT,
        IF_KW,
        ELSE_KW,
        FOR_KW,
        WHILE_KW,
        DO_KW,
        RETURN_KW,
        USING_KW,
        FUNCTION_KW,
        CLASS_KW,
        NEW_KW,
        THIS_KW,
        STATIC_KW,
        PUBLIC_KW,
        PRIVATE_KW,
        TRY_KW,
        CATCH_KW,
        THROW_KW,
        IN_KW,
        INTERFACE_KW,
        INT_KW,
        TRUE_KW,
        FALSE_KW,
        FLOAT_KW,
        DOUBLE_KW,
        CHAR_KW,
        STRING_KW,
        BOOL_KW,
        VOID_KW,
        NAN_KW,
        IDENTIFIER,
        NEWLINE,
        EOF,
        ERROR,
        NULL_TYPE,
        INTEGER_TYPE,
        STRING_TYPE,
        BOOLEAN_TYPE,
        FLOAT_TYPE,
        DOUBLE_TYPE,
        CHARACTER_TYPE,
        VOID_TYPE,
        NOTANUMBER_TYPE,
        R_PAREN,
        L_PAREN,
        L_CURLY,
        R_CURLY,
        L_BRACKET,
        R_BRACKET,
        SEMICOLON,
        COMMA,
        COLON,
        DOT
    }
}

namespace v8.backend.lexer
{
    public class TokenDictionary
    {
        public Dictionary<string, Types> tokenDictionary = new Dictionary<string, Types>();
        public Traceback trace = new Traceback();

        public TokenDictionary()
        {
            tokenDictionary.Add("/", Types.MathOP_DIV);
            tokenDictionary.Add("*", Types.MathOP_MULT);
            tokenDictionary.Add("+", Types.MathOP_PLUS);
            tokenDictionary.Add("-", Types.MathOP_MINUS);
            tokenDictionary.Add("%", Types.MathOP_MOD);
            tokenDictionary.Add("^", Types.MathOP_POW);
            tokenDictionary.Add("++", Types.OP_INC);
            tokenDictionary.Add("--", Types.OP_DEC);
            tokenDictionary.Add("=", Types.OP_ASSIGN);
            tokenDictionary.Add("+=", Types.OP_ASSIGN_PLUS);
            tokenDictionary.Add("-=", Types.OP_ASSIGN_MINUS);
            tokenDictionary.Add("*=", Types.OP_ASSIGN_MULT);
            tokenDictionary.Add("/=", Types.OP_ASSIGN_DIV);
            tokenDictionary.Add("%=", Types.OP_ASSIGN_MOD);
            tokenDictionary.Add("^=", Types.OP_ASSIGN_POW);
            tokenDictionary.Add("==", Types.OP_EQUAL);
            tokenDictionary.Add("!=", Types.OP_NOT_EQUAL);
            tokenDictionary.Add(">", Types.OP_GREATER);
            tokenDictionary.Add("<", Types.OP_LESS);
            tokenDictionary.Add(">=", Types.OP_GREATER_EQUAL);
            tokenDictionary.Add("<=", Types.OP_LESS_EQUAL);
            tokenDictionary.Add("&&", Types.OP_AND);
            tokenDictionary.Add("||", Types.OP_OR);
            tokenDictionary.Add("!", Types.OP_NOT);
            tokenDictionary.Add("if", Types.IF_KW);
            tokenDictionary.Add("else", Types.ELSE_KW);
            tokenDictionary.Add("for", Types.FOR_KW);
            tokenDictionary.Add("while", Types.WHILE_KW);
            tokenDictionary.Add("do", Types.DO_KW);
            tokenDictionary.Add("return", Types.RETURN_KW);
            tokenDictionary.Add("using", Types.USING_KW);
            tokenDictionary.Add("function", Types.FUNCTION_KW);
            tokenDictionary.Add("class", Types.CLASS_KW);
            tokenDictionary.Add("new", Types.NEW_KW);
            tokenDictionary.Add("this", Types.THIS_KW);
            tokenDictionary.Add("static", Types.STATIC_KW);
            tokenDictionary.Add("public", Types.PUBLIC_KW);
            tokenDictionary.Add("private", Types.PRIVATE_KW);
            tokenDictionary.Add("try", Types.TRY_KW);
            tokenDictionary.Add("catch", Types.CATCH_KW);
            tokenDictionary.Add("throw", Types.THROW_KW);
            tokenDictionary.Add("in", Types.IN_KW);
            tokenDictionary.Add("interface", Types.INTERFACE_KW);
            tokenDictionary.Add("int", Types.INT_KW);
            tokenDictionary.Add("true", Types.TRUE_KW);
            tokenDictionary.Add("false", Types.FALSE_KW);
            tokenDictionary.Add("float", Types.FLOAT_KW);
            tokenDictionary.Add("double", Types.DOUBLE_KW);
            tokenDictionary.Add("char", Types.CHAR_KW);
            tokenDictionary.Add("string", Types.STRING_KW);
            tokenDictionary.Add("bool", Types.BOOL_KW);
            tokenDictionary.Add("void", Types.VOID_KW);
            tokenDictionary.Add("(", Types.L_PAREN);
            tokenDictionary.Add(")", Types.R_PAREN);
            tokenDictionary.Add("{", Types.L_CURLY);
            tokenDictionary.Add("}", Types.R_CURLY);
            tokenDictionary.Add("[", Types.L_BRACKET);
            tokenDictionary.Add("]", Types.R_BRACKET);
            tokenDictionary.Add(";", Types.SEMICOLON);
            tokenDictionary.Add(",", Types.COMMA);
            tokenDictionary.Add(":", Types.COLON);
            tokenDictionary.Add(".", Types.DOT);
        }

        public Types GetTokenType(string token)
        {
            if (tokenDictionary.ContainsKey(token))
            {
                return tokenDictionary[token];
            }
            else
            {
                return Types.NULL_TYPE;
            }
        }

        public bool IsKeyword(string token)
        {
            // Keyword list
            string[] keywords = { "if", "else", "for", "while", "do", "return", "using", "function", "class", "new", "this", "static", "public", "private", "try", "catch", "throw", "in", "interface", "int", "true", "false", "float", "double", "char", "string", "bool", "void" };

            // Check if token is in keyword list
            if (keywords.Contains(token))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool IsOperator(string token)
        {
            // Operator list
            string[] operators = { "/", "*", "+", "-", "%", "^", "++", "--", "=", "+=", "-=", "*=", "/=", "%=", "^=", "==", "!=", ">", "<", ">=", "<=", "&&", "||", "!" };

            // Check if token is in operator list
            if (operators.Contains(token))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool IsPunctuation(string token)
        {
            // Punctuation list
            string[] punctuation = { "(", ")", "{", "}", "[", "]", ";", ",", ":", "." };

            // Check if token is in punctuation list
            if (punctuation.Contains(token))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool IsIdentifier(string token)
        {
            // Check if token is a valid identifier
            if (Regex.IsMatch(token, @"^[a-zA-Z_][a-zA-Z0-9_]*$"))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool IsNumber(string token)
        {
            // Check if token is a valid number Validate with int, double & float Ex: 1.1, 1, 0, -1 etc
            if (Regex.IsMatch(token, @"^[-]?[0-9]*\.?[0-9]+$"))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool IsString(string token)
        {
            // Check if token is a valid string Ex: "Hello World", "Hello", "World" etc
            if (Regex.IsMatch(token, "\"(\\\\.|[^\"])*\""))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool IsChar(string token)
        {
            // Check if token is a valid char Ex: 'a', 'b', 'c' etc
            if (Regex.IsMatch(token, @"^'([^\r\n\\]|\\[\\'" + "\"nrt])'$"))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool IsComment(string token)
        {
            // Check if token is a valid comment Ex: # comment
            if (Regex.IsMatch(token, @"^#.*$"))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool IsWhiteSpace(string token)
        {
            // Check if token is a valid whitespace Ex: " ",
            if (Regex.IsMatch(token, @"^[\s]+$"))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool IsNewLine(string token)
        {
            // Check if token is a valid new line Ex: "\n", "\r\n"
            if (Regex.IsMatch(token, @"\n|\r\n|\r"))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool IsEndOfFile(string token)
        {
            // Check if token is a valid end of file Ex: \0
            if (Regex.IsMatch(token, @"\0"))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool IsInvalid(string token)
        {
            string[] specialChars = { "\"", "\'" };

            if (!tokenDictionary.ContainsKey(token) || !specialChars.Contains(token))
            {
                return false;
            }
            else
            {
                return true;
            }
        }
    }

    public class Tokenizer
    {
        private string sourceCode;
        private int index;
        private int line;
        private int column;
        private char cursor;
        private string readingBuffer; // Cursor append each token to this and this will be validated when mach return new token
        private int tokenStart;
        private string fileName;
        private Traceback traceback;
        private TokenDictionary tokenDictionary;
        private List<Token> tokens = new();
        private SourceCode src;

        public Tokenizer(string sourceCode, string fileName)
        {
            this.sourceCode = sourceCode;
            index = 0;
            line = 1;
            column = 1;
            cursor = sourceCode[index];
            readingBuffer = "";
            tokenStart = 0;
            traceback = new Traceback();
            tokenDictionary = new TokenDictionary();
            this.fileName = fileName;
            src = new SourceCode(sourceCode);
        }

        // Methods
        private void ClearBuffer()
        {
            readingBuffer = "";
        }

        private void AppendToBuffer()
        {
            readingBuffer += cursor;
        }

        private void AppendToBuffer(char c)
        {
            readingBuffer += c;
        }

        private char PeekPosition()
        {
            return sourceCode[index + 1];
        }

        private void AdvanceCursor()
        {
            if (index + 1 < sourceCode.Length)
            {
                index++;
                cursor = sourceCode[index];
                column++;
            }
            else
            {
                cursor = '\0';
            }
        }

        private void AdvanceLine()
        {
            line++;
            column = 1;
        }

        private void SavePosition()
        {
            tokenStart = index;
        }

        private void ConsumeToken(Types type)
        {
            tokens.Add(new Token(type, readingBuffer, index, column, line, tokenStart, index, fileName));
        }

        private void ConsumeToken(string token)
        {
            Types gettype = tokenDictionary.GetTokenType(token);
            if(gettype == Types.ERROR)
            {
                traceback.AddError(new IllegalCharError(new Token(Types.ERROR, token, index, column, line, tokenStart, index, fileName), src));
            }
            tokens.Add(new Token(gettype, token, index, column, line, tokenStart, index, fileName));
        }
        
        private void MakeString()
        {
            ClearBuffer();
            while (cursor != '"' || cursor != '\0')
            {
                if (cursor == '\"')
                {
                    break;
                }
                else if(cursor == '\\')
                {
                    AdvanceCursor();
                    switch(cursor)
                    {
                        case 'n':
                            AppendToBuffer('\n');
                            break;
                        case 't':
                            AppendToBuffer('\t');
                            break;
                        case 'r':
                            AppendToBuffer('\r');
                            break;
                        case '\\':
                            AppendToBuffer('\\');
                            break;
                        case '\'':
                            AppendToBuffer('\'');
                            break;
                        case '\"':
                            AppendToBuffer('\"');
                            break;
                        default:
                            traceback.AddError(new IllegalCharError(new Token(Types.ERROR, cursor.ToString(), index, column, line, tokenStart, index, fileName), src));
                            break;
                    }                            
                }
                else{
                    AppendToBuffer(cursor);
                    AdvanceCursor();
                }
            }
            ConsumeToken(Types.STRING_TYPE);
            AdvanceCursor();
            return;
        }

        public static Token MakeNumber(Token input, SourceCode src)
        {
            Integer intVal = new Integer(input.value);
            Float floatVal = new Float(input.value);

            if(intVal.Rule(input.value)){
                return new Token(Types.INTEGER_TYPE, input.value, input.index, input.colum, input.line, input.PosStart, input.PosEnd, input.file);                 
            }
            if(floatVal.Rule(input.value)){
                // Validate float
                string number = "";
                int dots = 0;

                for (int i = 0; i < input.value.Length; i++)
                {
                    if (input.value[i] == '.')
                    {
                        dots++;
                        if (dots > 1)
                        {
                            Traceback trace = new Traceback();
                            trace.AddError(new InvalidNumberError(input, src));
                            trace.Throw();            
                        }
                        else
                        {
                            number += input.value[i];
                        }
                    }
                    else
                    {
                        number += input.value[i];
                    }
                }

                return new Token(Types.FLOAT_TYPE, number, input.index, input.colum, input.line, input.PosStart, input.PosEnd, input.file);
            }
            return new Token(Types.NOTANUMBER_TYPE, "NaN", input.index, input.colum, input.line, input.PosStart, input.PosEnd, input.file);
        }

        private void MakeIdentifier()
        {
            while (tokenDictionary.IsIdentifier(cursor.ToString()))
            {
                AppendToBuffer();
                AdvanceCursor();
            }
            if (tokenDictionary.IsKeyword(readingBuffer))
            {
                ConsumeToken(readingBuffer);
            }
            else
            {
                ConsumeToken(Types.IDENTIFIER);
            }
            ClearBuffer();
        }

        private void MakeOperator()
        {
            while (tokenDictionary.IsOperator(cursor.ToString()))
            {
                AppendToBuffer();
                AdvanceCursor();
            }
            ConsumeToken(readingBuffer);
            ClearBuffer();
        }
        
        private void GetToken()
        {
            AppendToBuffer();

            if (tokenDictionary.IsEndOfFile(readingBuffer))
            {
                if(traceback.HasTraceback())
                {
                    traceback.Throw();
                }
                return;
            }
            else if (tokenDictionary.IsNewLine(readingBuffer))
            {
                AdvanceLine();
                AdvanceCursor();
                ClearBuffer();
                GetToken();
                return;
            }
            else if (tokenDictionary.IsComment(readingBuffer))
            {
                ClearBuffer();
                SavePosition();
                while (!tokenDictionary.IsNewLine(cursor.ToString()))
                {
                    AdvanceCursor();
                }
                GetToken();
                return;
            }
            else if (tokenDictionary.IsWhiteSpace(readingBuffer))
            {
                AdvanceCursor();
                ClearBuffer();
                GetToken();
                return;
            }
            else if (cursor == '\"')
            {
                SavePosition();
                AdvanceCursor();
                MakeString();
                GetToken();
                ClearBuffer();
                return;
            }
            else if (tokenDictionary.IsIdentifier(readingBuffer))
            {
                ClearBuffer();
                SavePosition();
                MakeIdentifier();
                GetToken();
                return;
            }
            else if (tokenDictionary.IsNumber(readingBuffer))
            {
                ClearBuffer();
                SavePosition();
                while (tokenDictionary.IsNumber(cursor.ToString()))
                {
                    AppendToBuffer();
                    AdvanceCursor();
                }
                if (cursor == '.')
                {
                    AppendToBuffer();
                    AdvanceCursor();
                    while (tokenDictionary.IsNumber(cursor.ToString()))
                    {
                        AppendToBuffer();
                        AdvanceCursor();
                    }
                    ConsumeToken(Types.FLOAT_TYPE);
                }
                else
                {
                    ConsumeToken(Types.INTEGER_TYPE);
                }
                GetToken();
                return;
            }
            else if (tokenDictionary.IsOperator(readingBuffer))
            {
                ClearBuffer();
                SavePosition();
                MakeOperator();
                GetToken();
                return;
            }
            else if (tokenDictionary.IsPunctuation(cursor.ToString()))
            {
                ConsumeToken(cursor.ToString());
                AdvanceCursor();
                ClearBuffer();
                GetToken();
                return;
            }
            else
            {
                traceback.AddError(new IllegalCharError(new Token(Types.ERROR, readingBuffer, index, column, line, tokenStart, index, fileName), src));
                AdvanceCursor();
                GetToken();
                return;
            }
        }

        public List<Token> Tokenize()
        {
            // Get the first token
            GetToken();

            // Return the tokens
            return tokens;
        }
    }
}
