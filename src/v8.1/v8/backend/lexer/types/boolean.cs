namespace v8.backend.lexer.types
{
    public class Boolean : IGenericType
    {
        private string value;

        public Boolean(string value)
        {
            this.value = value;
        }

        public bool Rule(string imput)
        {
            if (imput == "true" || imput == "false")
            {
                return true;
            }

            return false;
        }

        public dynamic getValues()
        {
            return this.value;
        }
    }
}
