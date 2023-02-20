namespace v8.backend.lexer.types
{
    public class String : IGenericType
    {
        private string value;

        public String(string value)
        {
            this.value = value;
        }

        public bool Rule(string imput)
        {
            if (imput.Length > 1)
            {
                return true;
            }

            return false;
        }

        public dynamic getValues()
        {
            return '"' + this.value + '"';
        }
    }
}