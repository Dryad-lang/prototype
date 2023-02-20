namespace v8.backend.lexer.types
{
    public class Float : IGenericType
    {
        private string value;
        private bool isNegative;

        public Float(string value)
        {
            this.value = value;
            this.isNegative = false;
        }

        public Float(string value, bool isNegative)
        {
            this.value = value;
            this.isNegative = isNegative;
        }

        public bool Rule(string imput)
        {
            const string floatOp = ".";
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
                    if (floatOp.Contains(imput[i]))
                    {
                        return true;
                    }
                    else
                    {
                        this.value += imput[i];
                    }
                }
                else
                {
                    this.value += imput[i];
                }
            }

            return false;
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