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

        public bool Rule(string imput)
        {
            const string digits = "0123456789";

            for (int i = 0; i < imput.Length; i++)
            {
                if (imput[i] == '-')
                {
                    this.isNegative = true;
                    continue;
                }

                if (!digits.Contains(imput[i]))
                {
                    return false;
                }
                else{
                    this.value += imput[i];
                }
            }
            return true;
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