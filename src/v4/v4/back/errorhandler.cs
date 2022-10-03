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
        public Info? Info { set; get; }
    }
}