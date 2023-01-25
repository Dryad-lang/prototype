namespace v8.backend.lexer.types
{
    public class PlusMathOperator : IGenericType
    {
        private string value;

        public PlusMathOperator(string value)
        {
            this.value = value;
        }

        public bool Rule(string imput)
        {
            const string plusOp = "+";

            if (plusOp.Contains(imput))
            {
                this.value = imput;
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
