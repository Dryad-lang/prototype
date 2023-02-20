namespace v8.backend.lexer.types
{
    public class Character : IGenericType
    {
        private string value;

        public Character(string value)
        {
            this.value = value;
        }

        public bool Rule(string imput)
        {
            if (imput.Length == 1)
            {
                return true;
            }

            return false;
        }

        public dynamic getValues()
        {
            return '\'' + this.value + '\'';
        }
    } 
}
