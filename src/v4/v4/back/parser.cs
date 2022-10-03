namespace v4.back
{
    public class Token
    {
        public string type { get; }
        public string value { get; }
        public int line { get; }
        public int column { get; }
        public int position { get; }

        public Token(string type, string value, int line, int column, int position)
        {
            this.type = type;
            this.value = value;
            this.line = line;
            this.column = column;
            this.position = position;
        }        
    }

    public class Tokenizer
    {
        private string input;
        private int position;
        private int line;
        private int column;
        private List<Token> tokens = new List<Token>();
        private InternalTypes internalTypes = new InternalTypes();

        public Tokenizer(string input)
        {
            this.input = input;
            this.position = 0;
            this.line = 1;
            this.column = 1;
        }

        public List<Token> tokenize()
        {
            while (position < input.Length)
            {
                char c = input[position];
                if (c == ' ' || c == '\t' || c == '\r')
                {
                    position++;
                    column++;
                }
                
            }
        }                
    }
}