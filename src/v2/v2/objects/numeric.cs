using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using v2.tools;

namespace v2.objects
{
    public class NumericValues
    {
        DefautTypes defautTypes = new();
        ErrorHandler errorHandler = new();
        const string DIGITS = "0123456789";

        public Token NumberFormat(string input, Info info)
        {
            string value = "";
            string result = "";
            int comma = 0;

            value = input.Replace(",", ".");

            for (int i = 0; i < value.Length; i++)
            {
                if (DIGITS.Contains(value[i]) || (value[i] == '.' && (comma == 0 || comma == 1)) || (value[i] == '.' && DIGITS.Contains(value[i + 1])))
                {
                    result += value[i];
                    if (value[i] == '.')
                    {
                        comma++;
                    }
                }
                else
                {
                    errorHandler.SetErrorType("SyntaxError").SetErrorMessage($"Unexpected character '{value[i]}'").SetInfo(info).ThrowError();
                }
            }

            if(comma == 0)
            {
                return new Token(defautTypes.TInt, result);
            }
            else
            {
                return new Token(defautTypes.TFloat, result);
            }
        }
    }
}
