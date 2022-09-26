using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using v2.objects;

namespace v2.tools
{
    public enum ErrorType
    {
        IllegalChar,
        SyntaxError,
        RuntimeError,
        InternalError
    }

    public class ErrorHandler
    {
        private ErrorType? _errortype;
        private string? _errormessage;
        private string? _errorchar;
        private Info info = new();

        


        public ErrorHandler SetErrorType(ErrorType errortype)
        {
            _errortype = errortype;
            return this;
        }

        public ErrorHandler SetErrorMessage(string errormessage)
        {
            _errormessage = errormessage;
            return this;
        }

        public ErrorHandler SetInfo(Info info)
        {
            this.info = info;
            return this;
        }

        public void ThrowError()
        {
            if (_errortype == null || _errormessage == null)
            {
                throw new Exception("Error type or message is null");
            }
            else if (_errortype == ErrorType.IllegalChar)
            {
                throw new Exception($"Illegal character at line {info.line} and column {info.colum}" + Environment.NewLine + _errormessage);
            }
            else if (_errortype == ErrorType.SyntaxError)
            {
                throw new Exception($"Syntax error at ");
            }
        }
    }
}
