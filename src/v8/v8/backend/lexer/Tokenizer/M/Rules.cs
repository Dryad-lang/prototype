using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace v8.backend.lexer.Tokenizer.M
{


    class Rules
    {
        /*
        This class will have all the rules for the M tokenizer
        */

        public static bool IsMathOperator(string input)
        {
            const string operators = "+-*/^%";
            return operators.Contains(input);
        }

        public static bool IsNumberDigit(string input)
        {
            const string digits = "0123456789";
            return digits.Contains(input);
        }

        public static bool IsNumber(string input)
        {
            const string digits = "0123456789";
            for (int i = 0; i < input.Length; i++)
            {
                if (!digits.Contains(input[i]))
                {
                    return false;
                }
            }
            return true;
        }
    }
}
