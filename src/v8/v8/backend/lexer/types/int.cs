namespace v8.backend.lexer.types
{

    /*
        The integer type is a representation fro every numeric value that is in INTEGER NUNBERS

        -∞]0[∞+ 
    */

    public class Integer : IGenericType
    {
        private string value;
        private bool isNegative;

        public Integer(string value)
        {
            this.value = value;
            this.isNegative = false;
        }

        public Integer(string value, bool isNegative)
        {
            this.value = value;
            this.isNegative = isNegative;
        }

        public bool Rule(string c)
        {
            return c == "0" || c == "1" || c == "2" || c == "3" || c == "4" || c == "5" || c == "6" || c == "7" || c == "8" || c == "9";
        }

        public dynamic getValues()
        {
            return this.value;
        }

        public bool getIsNegative()
        {
            return this.isNegative;
        }
    }
}