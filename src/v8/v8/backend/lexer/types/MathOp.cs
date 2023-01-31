namespace v8.backend.lexer.types
{
    public class MathOperator : IGenericType
    {
        private string value;

        public MathOperator(string value)
        {
            this.value = value;
        }

        public bool Rule(string imput)
        {
            const string plusOp = "+";
            const string minusOp = "-";
            const string multOp = "*";
            const string divOp = "/";
            const string modOp = "%";
            const string powOp = "^";
            const string floorDivOp = "//";

            if (plusOp.Contains(imput))
            {
                this.value = imput;
                return true;
            }
            else if (minusOp.Contains(imput))
            {
                this.value = imput;
                return true;
            }
            else if (multOp.Contains(imput))
            {
                this.value = imput;
                return true;
            }
            else if (divOp.Contains(imput))
            {
                this.value = imput;
                return true;
            }
            else if (modOp.Contains(imput))
            {
                this.value = imput;
                return true;
            }
            else if (powOp.Contains(imput))
            {
                this.value = imput;
                return true;
            }
            else if (floorDivOp.Contains(imput))
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
