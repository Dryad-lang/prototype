using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using v8.backend.lexer;
using System.Diagnostics;

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
            /*
            Traceback message:

            ------------------------------------------------------------------
            |                 Error Traceback
            | Errors: <count>  Memory Usage: <bytes in MB> Process Number: <process number>
            ------------------------------------------------------------------
            | 1
                <err>
            | 2
                <err>
            ... 
                
            */

            int errorCount = 0;
            float memoryUsage = 0;
            int processNumber = 0;

            // Get memory usage from System.Diagnostics
            Process currentProcess = Process.GetCurrentProcess();
            memoryUsage = currentProcess.PrivateMemorySize64 / 1024 / 1024;

            // Get process number from System.Diagnostics
            processNumber = currentProcess.Id;

            // Get error count
            errorCount = this.Errors.Count;

            string traceback = "------------------------------------------------------------------\n" +
                               "|                 Error Traceback\n" +
                               "| Errors: " + errorCount + "  Memory Usage: " + memoryUsage + "mb Process Number: " + processNumber + "\n" +
                               "------------------------------------------------------------------\n\n";
        
            int i = 1;
            foreach (IGenericError error in this.Errors)
            {
                traceback += "| " + i + "\n" +
                             error.GetException().ToString() + "\n";
                i++;
            }

            traceback += "| \n";
            traceback += "------------------------------------------------------------------\n";

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
            string result = "#" + error.type + "\n";

            if (IsOnCode)
            {
                result += "File: " + error.token.file + "; " +" ln: " + error.token.line+ " pos: " + error.token.index + ";" + " col: " + error.token.colum + "; \n" +
                          StringWithArrows(error.token.lineData, error.PosStart, error.PosEnd) + "\n" + error.message + "\n";
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
        runtimeError,
        InvalidNumber
    }

    // Errors code dictionary
    public static class ErrorCodes
    {
        public static Dictionary<ErrorType, string> Codes = new Dictionary<ErrorType, string>()
        {
            {ErrorType.IllegalChar, "ILLEGAL_CHAR:00001"},
            {ErrorType.ExpectedChar, "EXPECTED_CHAR:00002"},
            {ErrorType.InvalidSyntax, "INVALID_SYNTAX:00003"},
            {ErrorType.runtimeError, "RUNTIME_ERROR:00004"},
            {ErrorType.InvalidNumber, "INVALID_NUMBER:00005"}
        };
    }

    // Error messages
    public static class ErrorMessages
    {
        public static Dictionary<ErrorType, string> Messages = new Dictionary<ErrorType, string>()
        {
            {ErrorType.IllegalChar, "Syntax error: Unexpected character encountered. Check that all characters in your code are valid and properly formatted."},
            {ErrorType.ExpectedChar, "Syntax error: Expected a specific character but received something else. Check that all characters in your code are valid and in the correct order."},
            {ErrorType.InvalidSyntax, "Syntax error: Invalid syntax. Check that your code is correctly structured and all syntax rules are followed."},
            {ErrorType.runtimeError, "Runtime error: An error occurred during program execution. Check your code for logical or other errors that may be causing the issue."},
            {ErrorType.InvalidNumber, "Syntax error: Invalid number. Check that all numeric values in your code are valid and properly formatted."}
        };
    }

    public class IllegalCharError : IGenericError
    {
        public Error error;

        public IllegalCharError(Token token)
        {
            this.error = new Error(ErrorCodes.Codes[ErrorType.IllegalChar], ErrorMessages.Messages[ErrorType.IllegalChar], token.lineData, token.PosStart, token.PosEnd, token);
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

        public ExpectedCharError(Token token)
        {
            this.error = new Error(ErrorCodes.Codes[ErrorType.ExpectedChar], ErrorMessages.Messages[ErrorType.ExpectedChar], token.lineData, token.PosStart, token.PosEnd, token);
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

        public InvalidSyntaxError(Token token)
        {
            this.error = new Error(ErrorCodes.Codes[ErrorType.InvalidSyntax], ErrorMessages.Messages[ErrorType.InvalidSyntax], token.lineData, token.PosStart, token.PosEnd, token);
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

        public RuntimeError(Token token)
        {
            this.error = new Error(ErrorCodes.Codes[ErrorType.runtimeError], ErrorMessages.Messages[ErrorType.runtimeError], token.lineData, token.PosStart, token.PosEnd, token);
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

    public class InvalidNumberError : IGenericError
    {
        public Error error;

        public InvalidNumberError(Token token)
        {
            this.error = new Error(ErrorCodes.Codes[ErrorType.InvalidNumber], ErrorMessages.Messages[ErrorType.InvalidNumber], token.lineData, token.PosStart, token.PosEnd, token);
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
}
