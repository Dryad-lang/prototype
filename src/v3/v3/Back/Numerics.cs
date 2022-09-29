using v3.back.objects;

namespace v3.back
{
    public class NumericValues
    {
        private InternalTypes types = new InternalTypes();
        private ErrorHandler errorHandler = new ErrorHandler();
        private string digits = "0123456789";
        private string floatDigits = ".";

        public Token MakeNumber(string input, Info info)
        {
            string value = "";
            string result = "";
            int comma = 0;

            value = input.Replace(",", ".");

            for (int i = 0; i < value.Length; i++)
            {
                if (digits.Contains(value[i]) || floatDigits.Contains(value[i]))
                {
                    result += value[i];
                }
                else if (floatDigits.Contains(value[i]))
                {
                    if (comma <= 1)
                    {
                        result += value[i];
                        comma++;
                    }
                    else
                    {
                        errorHandler
                        .SetType(ErrorType.UnexpectedToken)
                        .SetToken(value[i].ToString())
                        .SetInfo(info)
                        .ThrowError();
                        return new Token("\0", types.TInt, info);
                    }
                }
                else
                {
                    errorHandler
                    .SetType(ErrorType.UnexpectedToken)
                    .SetToken(value[i].ToString())
                    .SetInfo(info)
                    .ThrowError();
                    return new Token("\0", types.TInt, info);
                }
            }
            
            if (result[0] == '.')
            {
                result = "0" + result;
            }
            else if (result[result.Length - 1] == '.')
            {
                result += "0";
            }

            if (result.Contains("."))
            {
                return new Token(result, types.TFloat, info);
            }
            else
            {
                return new Token(result, types.TInt, info);
            }
        }
    }
}