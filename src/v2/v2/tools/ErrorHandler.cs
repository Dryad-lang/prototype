using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using v2.objects;

namespace v2.tools
{
    public class ErrorHandler
    {
        private string? _errortype;
        private string? _errormessage;
        private Info info = new();

        public ErrorHandler SetErrorType(string errortype)
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
            throw new Exception($"Error: {_errortype} at line {info.line}, colum {info.colum}.\n{_errormessage}");
        }        
    }
}
