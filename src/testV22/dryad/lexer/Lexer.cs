using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using System.Threading.Tasks.Dataflow;
using System.Xml.Linq;

/*

Lexmes: São os tokens que o lexer reconhece. Exemplo: int, float, string, if, else, while, for, id, num, op, etc.
 
 // Keywords
    {name:"LX_IF", rx:'if(?![a-zA-Z0-9_])'},
    {name:"LX_ELSE", rx:'else(?![a-zA-Z0-9_])'},
    {name:"LX_WHILE", rx:'while(?![a-zA-Z0-9_])'},
    {name:"LX_DO", rx:'do(?![a-zA-Z0-9_])'},
    {name:"LX_FOR", rx:'for(?![a-zA-Z0-9_])'},
    {name:"LX_FUNC", rx:'function(?![a-zA-Z0-9_])'},
    {name:"LX_VAR", rx:'var(?![a-zA-Z0-9_])'},
    {name:"LX_RETURN", rx:'return(?![a-zA-Z0-9_])'},
    // Import
    {name:"LX_IMPORT", rx:'import(?![a-zA-Z0-9_])'},
    // Export
    {name:"LX_EXPORT", rx:'export(?![a-zA-Z0-9_])'},

    // Constants
    {name:"LX_ID", rx:'[a-zA-Z_][a-zA-Z0-9_]*'},
    {name:"LX_NUMBER", rx:'[0-9]+(\\.[0-9]*)?'},
    {name:"LX_STRING", rx:'"(\\\\"|[^"])*"|' + "'(\\\\'|[^'])*'"},

    // Punctuation
    {name:"LX_LPAREN", rx:'\\('},
    {name:"LX_RPAREN", rx:'\\)'},
    {name:"LX_LCURLY", rx:'\\{'},
    {name:"LX_RCURLY", rx:'\\}'},
    {name:"LX_LBRACKET", rx:'\\['},
    {name:"LX_RBRACKET", rx:'\\]'},
    {name:"LX_SEMICOLON", rx:';'},
    {name:"LX_COLON", rx:':'},
    {name:"LX_COMMA", rx:','},
    {name:"LX_DOT", rx:'\\.'},

    // Logical
    {name:"LX_LAND", rx:'&&'},
    {name:"LX_LOR", rx:'\\|\\|'},

    // Special assign
    {name:"LX_PLUSSET", rx:'\\+='},
    {name:"LX_MINUSSET", rx:'-='},
    {name:"LX_MULTSET", rx:'\\*='},
    {name:"LX_DIVSET", rx:'/='},
    {name:"LX_MODULOSET", rx:'%='},
    {name:"LX_ANDSET", rx:'&='},
    {name:"LX_ORSET", rx:'\\|='},
    {name:"LX_XORSET", rx:'\\^='},
    {name:"LX_LSHIFTSET", rx:'<<='},
    {name:"LX_RSHIFTSET", rx:'>>='},

    // Binary
    {name:"LX_AND", rx:'&'},
    {name:"LX_OR", rx:'\\|'},
    {name:"LX_XOR", rx:'\\^'},
    {name:"LX_NOT", rx:'~'},
    {name:"LX_LSHIFT", rx:'<<'},
    {name:"LX_RSHIFT", rx:'>>'},

    // Comparison
    {name:"LX_EQ", rx:'=='},
    {name:"LX_NEQ", rx:'!='},
    {name:"LX_LE", rx:'<='},
    {name:"LX_GE", rx:'>='},
    {name:"LX_LT", rx:'<'},
    {name:"LX_GT", rx:'>'},

    // Logical not
    {name:"LX_LNOT", rx:'!'},

    // Assignment
    {name:"LX_ASSIGN", rx:'='},

    // Operators
    {name:"LX_INC", rx:'\\+\\+'},
    {name:"LX_DEC", rx:'--'},
    {name:"LX_POW", rx:'\\*\\*'},
    {name:"LX_PLUS", rx:'\\+'},
    {name:"LX_MINUS", rx:'-'},
    {name:"LX_MULT", rx:'\\*'},
    {name:"LX_DIV", rx:'/'},
    {name:"LX_MODULO", rx:'%'}
*/


namespace dryad.lexer
{
    class Token
    {
        public string? lexeme; // O valor do lexema
        public string? type;   // O tipo do lexema (nome do token)
        public int line;       // Linha do lexema no código
        public int column;     // Coluna do lexema no código

        public Token(string lexeme, string type, int line, int column)
        {
            this.lexeme = lexeme;
            this.type = type;
            this.line = line;
            this.column = column;
        }
    }

    class LexerLister
    {
        // Dicionário para armazenar padrões de regex para tokens
        Dictionary<string, string> regexPatterns;

        public LexerLister()
        {
            // Inicializa os padrões de regex
            regexPatterns = new Dictionary<string, string>
            {
                // Keywords
                { "LX_IF", @"if(?![a-zA-Z0-9_])" },
                { "LX_ELSE", @"else(?![a-zA-Z0-9_])" },
                { "LX_WHILE", @"while(?![a-zA-Z0-9_])" },
                { "LX_DO", @"do(?![a-zA-Z0-9_])" },
                { "LX_FOR", @"for(?![a-zA-Z0-9_])" },
                { "LX_FUNC", @"function(?![a-zA-Z0-9_])" },
                { "LX_VAR", @"var(?![a-zA-Z0-9_])" },
                { "LX_RETURN", @"return(?![a-zA-Z0-9_])" },
                { "LX_IMPORT", @"import(?![a-zA-Z0-9_])" },
                { "LX_EXPORT", @"export(?![a-zA-Z0-9_])" },

                // Constants
                { "LX_ID", @"[a-zA-Z_][a-zA-Z0-9_]*" },
                { "LX_NUMBER", @"[0-9]+(\.[0-9]*)?" },
                { "LX_STRING", @"""(\\""|[^""])*""|'(\\'|[^'])*'" },

                // Punctuation
                { "LX_LPAREN", @"\(" },
                { "LX_RPAREN", @"\)" },
                { "LX_LCURLY", @"\{" },
                { "LX_RCURLY", @"\}" },
                { "LX_LBRACKET", @"\[" },
                { "LX_RBRACKET", @"\]" },
                { "LX_SEMICOLON", @";" },
                { "LX_COLON", @":" },
                { "LX_COMMA", @"," },
                { "LX_DOT", @"\." },

                // Logical
                { "LX_LAND", @"&&" },
                { "LX_LOR", @"\|\|" },

                // Special assign
                { "LX_PLUSSET", @"\+=" },
                { "LX_MINUSSET", @"-=" },
                { "LX_MULTSET", @"\*=" },
                { "LX_DIVSET", @"/=" },
                { "LX_MODULOSET", @"%=" },
                { "LX_ANDSET", @"&=" },
                { "LX_ORSET", @"\|=" },
                { "LX_XORSET", @"\^=" },
                { "LX_LSHIFTSET", @"<<=" },
                { "LX_RSHIFTSET", @">>=" },

                // Binary
                { "LX_AND", @"&" },
                { "LX_OR", @"\|" },
                { "LX_XOR", @"\^" },
                { "LX_NOT", @"~" },
                { "LX_LSHIFT", @"<<" },
                { "LX_RSHIFT", @">>" },

                // Comparison
                { "LX_EQ", @"==" },
                { "LX_NEQ", @"!=" },
                { "LX_LE", @"<=" },
                { "LX_GE", @">=" },
                { "LX_LT", @"<" },
                { "LX_GT", @">" },

                // Logical not
                { "LX_LNOT", @"!" },

                // Assignment
                { "LX_ASSIGN", @"=" },

                // Operators
                { "LX_INC", @"\+\+" },
                { "LX_DEC", @"--" },
                { "LX_POW", @"\*\*" },
                { "LX_PLUS", @"\+" },
                { "LX_MINUS", @"-" },
                { "LX_MULT", @"\*" },
                { "LX_DIV", @"/" },
                { "LX_MODULO", @"%" },

                // Ignored tokens
                { "LX_SPACE", @"\s" },
                { "LX_NEWL", @"\n" },
                { "LX_TAB", @"\t" },
                
                // Comment (Also ignored)
                { "LX_COMMENT_LN", @"\/\/.*" },
                { "LX_COMMENT_ML", @"\/\*.*\*\/" },

                // SYS 
                { "EOF", @"$" }
            };
        }

        // Função para tokenizar uma entrada
        public List<Token> Tokenize(string input)
        {
            List<Token> tokens = new List<Token>();
            int line = 1;
            int column = 1;

            if (input != null || input.Length == 0)
            {
                throw new Exception("Empty input");
            }

            while (input.Length > 0)
            {
                bool matched = false;

                foreach (var pattern in regexPatterns)
                {
                    var match = System.Text.RegularExpressions.Regex.Match(input, "^" + pattern.Value);
                    if (match.Success)
                    {
                        tokens.Add(new Token(match.Value, pattern.Key, line, column));
                        column += match.Length;
                        input = input.Substring(match.Length); // Avança a string de entrada
                        matched = true;
                        break;
                    }
                }

                if (!matched)
                {
                    throw new Exception($"Unrecognized token at line {line}, column {column}");
                }

                if (input.Length == 0)
                {
                    tokens.Add(new Token("", "EOF", line, column));
                }
            }



            return tokens;
        }
    }
}