namespace v3.back.objects
{
    public class Token
    {
        public string Char { get; }
        public string Type { get; }
        public Info Info { get; }

        public Token(string _char, string _type, Info _info)
        {   
            this.Char = _char;
            this.Type = _type;
            this.Info = _info;
        }
    }
}