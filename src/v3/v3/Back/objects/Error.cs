namespace v3.back.objects
{
    public enum ErrorType
    {
        SintaxError,
        UnexpectedToken,
        RuntimeError,
        InternalError        
    }

    public class Error
    {
        public ErrorType Type { set; get; }
        public string? Message { set; get; }
        public string? Token { set; get; }
        public Info? Info { set; get; }
    }

    public class ErrorHandler
    {
        private Error error = new();

        public ErrorHandler SetType(ErrorType type)
        {
            this.error.Type = type;
            return this;
        }

        public ErrorHandler SetMessage(string message)
        {
            this.error.Message = message;
            return this;
        }

        public ErrorHandler SetToken(string token)
        {
            this.error.Token = token;
            return this;
        }

        public ErrorHandler SetInfo(Info info)
        {
            this.error.Info = info;
            return this;
        }

        public void ThrowError()
        {
            if(this.error == null)
            {
                throw new Exception("Something went wrong");
            }
            else if(error.Type == ErrorType.UnexpectedToken)
            {
                throw new Exception($"Unexpected token '{error.Token}' at line {error.Info?.line}, colum {error.Info?.colum}, position {error.Info?.position}");
            }
            else if(error.Type == ErrorType.SintaxError)
            {
                throw new Exception($"Sintax error at line {error.Info?.line}, colum {error.Info?.colum}, position {error.Info?.position}" + Environment.NewLine + error.Message);
            }
            else if(error.Type == ErrorType.RuntimeError)
            {
                throw new Exception($"Runtime error: {error.Message}");
            }
            else if(error.Type == ErrorType.InternalError)
            {
                throw new Exception($"Internal error: {error.Message}");
            }
            else
            {
                throw new Exception("Something went wrong");
            }
        }
    }
}