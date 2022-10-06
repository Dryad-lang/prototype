public namespace v3.back
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

    }

    public class ErrorHandler
    {
        Console console = new Console();

        Error error = new();

        public ErrorHandler SetType(ErrorType type)
        {
            error.Type = type;
            return this;
        }

        public ErrorHandler SetMessage(string message)
        {
            error.Message = message;
            return this;
        }

        public ErrorHandler SetToken(string token)
        {
            error.Token = token;
            return this;
        }

        public void Throw()
        {
            if(error.Type == ErrorType.UnexpectedToken)
            {
                console.WriteLine($"Unexpected token '{error.Token}' at line {console.Line} column {console.Column}");
            }
            else if(error.Type == ErrorType.SintaxError)
            {
                console.WriteLine($"Sintax error at line {console.Line} column {console.Column}");
            }
            else if(error.Type == ErrorType.RuntimeError)
            {
                console.WriteLine($"Runtime error: {error.Message}");
            }
            else if(error.Type == ErrorType.InternalError)
            {
                console.WriteLine($"Internal error: {error.Message}");
            }
            else
            {
                console.WriteLine($"Unknown error: {error.Message}");
            }


        }
    }
}