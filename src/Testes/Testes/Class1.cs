using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Testes
{
    public class lex
    {
        public string MakeNumber(string value)
        {
            const string DIGITS = "0123456789";
            string _value = "";
            string result = "";
            int coma = 0;

            //Finds dots and replaces them with commas if exists
            _value = value.Replace(".", ",");

            foreach (char c in _value)
            {
                if (DIGITS.Contains(c.ToString()))
                {
                    result += c;
                }
                else if (c == ',')
                {
                    coma++;
                    if (coma > 1)
                    {
                        throw new Exception("Invalid number");
                    }
                    result += c;
                }
                else
                {
                    break;
                }
            }

            return result;
        }
    }

}
