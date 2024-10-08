﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using v8.backend.lexer;
using System.Diagnostics;
using v8.backend.analyzer;

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

        public bool HasTraceback()
        {
            return this.Errors.Count > 0;
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

            string traceback = "\n------------------------------------------------------------------\n" +
                               "|                 Error Traceback" + "                                \n" + 
                               "| Errors: " + errorCount + "  Memory Usage: " + memoryUsage + "mb Process Number: " + processNumber + "            \n"+ 
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
            pos_start += 1;
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

        public static string BuildErrorMessage(Error error, string SrcLine, bool IsOnCode = false)
        {
            string result = "#" + error.type + "\n";

            if (IsOnCode)
            {
                result += "File: " + error.token.file + "; " +" ln: " + error.token.line+ " pos: " + error.token.index + ";" + " col: " + error.token.colum + "; \n" +
                          StringWithArrows(SrcLine, error.PosStart, error.PosEnd) + "\n" + error.message + "\n";
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
        InvalidNumber,
        UnterminatedStringError
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
            {ErrorType.InvalidNumber, "INVALID_NUMBER:00005"},
            {ErrorType.UnterminatedStringError, "UNTERMINATED_STRING:00006"}
        };
    }

    // Error messages
    public static class ErrorMessages
    {
        public static Dictionary<ErrorType, string> Messages = new Dictionary<ErrorType, string>()
        {
            {ErrorType.IllegalChar, "Syntax error: Invalid character."},
            {ErrorType.ExpectedChar, "Syntax error: Expected a different character."},
            {ErrorType.InvalidSyntax, "Syntax error: Invalid syntax."},
            {ErrorType.runtimeError, "Runtime error: An error occurred during program execution."},
            {ErrorType.InvalidNumber, "Syntax error: Invalid number."},
            {ErrorType.UnterminatedStringError, "Syntax error: Unterminated string."}
        };
    }

    public class IllegalCharError : IGenericError
    {
        public Error error;
        SourceCode src;

        public IllegalCharError(Token token, SourceCode src)
        {
            this.src = src;
            System.Console.WriteLine(src.lines[0]);
            string? code = src.GetLine(token.line);

            this.error = new Error(ErrorCodes.Codes[ErrorType.IllegalChar], ErrorMessages.Messages[ErrorType.IllegalChar], code ?? "", token.PosStart, token.PosEnd, token);
        }

        public IGenericError GetException()
        {
            // Return exeption
            return this;
        }

        // Throw errors
        public void Throw()
        {
            string? code = this.src.GetLine(this.error.token.line);
            throw new Exception(ErrorUtils.BuildErrorMessage(this.error, code ?? "", true));
        }

        public override string ToString()
        {
            string? code = this.src.GetLine(this.error.token.line);
            return ErrorUtils.BuildErrorMessage(this.error, code ?? "", true);
        }
    }

    public class ExpectedCharError : IGenericError
    {
        public Error error;
        SourceCode src;

        public ExpectedCharError(Token token, SourceCode src)
        {
            this.src = src;
            string? code = src.GetLine(token.line);

            this.error = new Error(ErrorCodes.Codes[ErrorType.ExpectedChar], ErrorMessages.Messages[ErrorType.ExpectedChar], code ?? "", token.PosStart, token.PosEnd, token);
        }

        public IGenericError GetException()
        {
            // Return exeption
            return this;
        }

        // Throw errors
        public void Throw()
        {
            string? code = this.src.GetLine(this.error.token.line);
            throw new Exception(ErrorUtils.BuildErrorMessage(this.error, code ?? "", true));
        }

        public override string ToString()
        {
            string? code = this.src.GetLine(this.error.token.line);
            return ErrorUtils.BuildErrorMessage(this.error, code ?? "", true);
        }
    }

    public class InvalidSyntaxError : IGenericError
    {
        public Error error;
        SourceCode src;

        public InvalidSyntaxError(Token token, SourceCode src)
        {
            this.src = src;
            string? code = src.GetLine(token.line);

            this.error = new Error(ErrorCodes.Codes[ErrorType.InvalidSyntax], ErrorMessages.Messages[ErrorType.InvalidSyntax], code ?? "", token.PosStart, token.PosEnd, token);
        }

        public IGenericError GetException()
        {
            // Return exeption
            return this;
        }

        // Throw errors
        public void Throw()
        {
            string? code = this.src.GetLine(this.error.token.line);
            throw new Exception(ErrorUtils.BuildErrorMessage(this.error, code ?? "", true));
        }

        public override string ToString()
        {
            string? code = this.src.GetLine(this.error.token.line);
            return ErrorUtils.BuildErrorMessage(this.error, code ?? "", true);
        }
    }

    public class RuntimeError : IGenericError
    {
        public Error error;
        SourceCode src;

        public RuntimeError(Token token, SourceCode src)
        {
            this.src = src;
            string? code = src.GetLine(token.line);

            this.error = new Error(ErrorCodes.Codes[ErrorType.runtimeError], ErrorMessages.Messages[ErrorType.runtimeError], code ?? "", token.PosStart, token.PosEnd, token);
        }

        public IGenericError GetException()
        {
            // Return exeption
            return this;
        }

        // Throw errors
        public void Throw()
        {
            string? code = this.src.GetLine(this.error.token.line);
            throw new Exception(ErrorUtils.BuildErrorMessage(this.error, code ?? "", true));
        }

        public override string ToString()
        {
            string? code = this.src.GetLine(this.error.token.line);
            return ErrorUtils.BuildErrorMessage(this.error, code ?? "", true);
        }
    }

    public class InvalidNumberError : IGenericError
    {
        public Error error;
        SourceCode src;

        public InvalidNumberError(Token token, SourceCode src)
        {
            this.src = src;
            string? code = src.GetLine(token.line);

            this.error = new Error(ErrorCodes.Codes[ErrorType.InvalidNumber], ErrorMessages.Messages[ErrorType.InvalidNumber], code ?? "", token.PosStart, token.PosEnd, token);
        }

        public IGenericError GetException()
        {
            // Return exeption
            return this;
        }

        // Throw errors
        public void Throw()
        {
            string? code = this.src.GetLine(this.error.token.line);
            throw new Exception(ErrorUtils.BuildErrorMessage(this.error, code ?? "", true));
        }

        public override string ToString()
        {
            string? code = this.src.GetLine(this.error.token.line);
            return ErrorUtils.BuildErrorMessage(this.error, code ?? "", true);
        }
    }

    public class UnterminatedStringError : IGenericError
    {
        public Error error;
        SourceCode src;

        public UnterminatedStringError(Token token, SourceCode src)
        {
            this.src = src;
            string? code = src.GetLine(token.line);

            this.error = new Error(ErrorCodes.Codes[ErrorType.UnterminatedStringError], ErrorMessages.Messages[ErrorType.UnterminatedStringError], code ?? "", token.PosStart, token.PosEnd, token);
        }

        public IGenericError GetException()
        {
            // Return exeption
            return this;
        }

        // Throw errors
        public void Throw()
        {
            string? code = this.src.GetLine(this.error.token.line);
            throw new Exception(ErrorUtils.BuildErrorMessage(this.error, code ?? "", true));
        }

        public override string ToString()
        {
            string? code = this.src.GetLine(this.error.token.line);
            return ErrorUtils.BuildErrorMessage(this.error, code ?? "", true);
        }
    }
}
