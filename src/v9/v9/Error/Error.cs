using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using v9.lexer;

namespace v9.utils
{
    public class ErrorMessage
    {
        public static Dictionary<string, string> ErrorMessages = new()
        {
            { "UNEXPECTED_CHAR", "Unexpected chat" },
            { "UNEXPECTED_EOF", "Unexpected end of file" },
            { "INVALID_NUMBER", "Invalid number" },
            { "INVALID_IDENTIFIER", "Invalid identifier" },
            { "INVALID_STRING", "Invalid string" },
            { "INVALID_OPERATOR", "Invalid operator" },
            { "INVALID_DELIMITER", "Invalid delimiter" },
        };

        public static string GetErrorMessage(string errorType)
        {
            return ErrorMessages[errorType];
        }

        public static string GetErrorMessage(string errorType, string details)
        {
            return ErrorMessages[errorType] + ": " + details;
        }
    }

    public class Error
    {
        public string message;
        public Token token;
        public string errorType;

        public Error(string message, Token token, string errorType)
        {
            this.message = message;
            this.token = token;
            this.errorType = errorType;
        }


    }
}
