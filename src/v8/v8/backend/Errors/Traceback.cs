using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using v8.backend.lexer;

namespace v8.backend.Errors
{
    public class Traceback
    {
        public List<IGenericError> Errors { get; private set; }

        public Traceback()
        {
            this.Errors = new List<IGenericError>();
        }

        public void AddError(IGenericError error)
        {
            this.Errors.Add(error);
        }

        public void Throw()
        {
            string traceback = "";

            foreach (var error in this.Errors)
            {
                traceback += error.ToString() + "\n";
            }

            throw new Exception(traceback);
        }
    }

    public class ErrorUtils
    {
        public static string StringWithArrows(string code, int pos_start, int pos_end)
        {
            // Build the arrow string
            string arrow_string = code + "\n";
            for (int i = 0; i < pos_start; i++)
            {
                arrow_string += " ";
            }
            for (int i = pos_start; i <= pos_end; i++)
            {
                arrow_string += "^";
            }

            return arrow_string;
        }

        public static string BuildErrorMessage(Error error, bool IsOnCode = false)
        {
            string result = "#" + error.code + " - " + error.type + " : " + error.details + "\n";

            if (IsOnCode)
            {
                result += "File: " + error.token.file + "; " + "idx: " + error.token.index + ";" + "col: " + error.token.colum + "; \n" +
                          StringWithArrows(error.token.line, error.PosStart, error.PosEnd) +" \n";
            }

            return result;
        }
    } 

    // Errors types
    public enum ErrorType
    {
        IllegalChar,
        ExpectedChar,
        InvalidSyntax,
        runtimeError
    }

    // Errors code dictionary
    public static class ErrorCodes
    {
        public static Dictionary<ErrorType, string> Codes = new Dictionary<ErrorType, string>()
        {
            {ErrorType.IllegalChar, "ILLEGAL_CHAR:00001"},
            {ErrorType.ExpectedChar, "EXPECTED_CHAR:00002"},
            {ErrorType.InvalidSyntax, "INVALID_SYNTAX:00003"},
            {ErrorType.runtimeError, "RUNTIME_ERROR:00004"}
        };
    }

    public class IllegalCharError : IGenericError
    {
        public Error error;

        public IllegalCharError(int pos_start, int pos_end, string details, Token token)
        {
            this.error = new Error("Illegal Character", details, ErrorCodes.Codes[ErrorType.IllegalChar], pos_start, pos_end, token);
        }

        public IGenericError GetException()
        {
            // Return exeption
            return this;
        }

        // Throw errors
        public void Throw()
        {
            throw new Exception(ErrorUtils.BuildErrorMessage(this.error, true));
        }

        public override string ToString()
        {
            return ErrorUtils.BuildErrorMessage(this.error, true);
        }
    }

    public class ExpectedCharError : IGenericError
    {
        public Error error;

        public ExpectedCharError(int pos_start, int pos_end, string details, Token token)
        {
            this.error = new Error("Expected Character", details, ErrorCodes.Codes[ErrorType.ExpectedChar], pos_start, pos_end, token);
        }

        public IGenericError GetException()
        {
            // Return exeption
            return this;
        }

        // Throw errors
        public void Throw()
        {
            throw new Exception(ErrorUtils.BuildErrorMessage(this.error, true));
        }

        public override string ToString()
        {
            return ErrorUtils.BuildErrorMessage(this.error, true);
        }
    }

    public class InvalidSyntaxError : IGenericError
    {
        public Error error;

        public InvalidSyntaxError(int pos_start, int pos_end, string details, Token token)
        {
            this.error = new Error("Invalid Syntax", details, ErrorCodes.Codes[ErrorType.InvalidSyntax], pos_start, pos_end, token);
        }

        public IGenericError GetException()
        {
            // Return exeption
            return this;
        }

        // Throw errors
        public void Throw()
        {
            throw new Exception(ErrorUtils.BuildErrorMessage(this.error, true));
        }

        public override string ToString()
        {
            return ErrorUtils.BuildErrorMessage(this.error, true);
        }
    }

    public class RuntimeError : IGenericError
    {
        public Error error;

        public RuntimeError(int pos_start, int pos_end, string details, Token token)
        {
            this.error = new Error("Runtime Error", details, ErrorCodes.Codes[ErrorType.runtimeError], pos_start, pos_end, token);
        }

        public IGenericError GetException()
        {
            // Return exeption
            return this;
        }

        // Throw errors
        public void Throw()
        {
            throw new Exception(ErrorUtils.BuildErrorMessage(this.error, false));
        }

        public override string ToString()
        {
            return ErrorUtils.BuildErrorMessage(this.error, false);
        }
    }

}
