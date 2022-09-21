using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace v2.objects
{
    public class DefautTypes
    {
        public readonly string FLOAT_DIGITS = ",.";
        public readonly string INT_DIGITS = "0123456789";
        // Types
        public readonly string TInt = "INT";
        public readonly string TFloat = "FLOAT";
        public readonly string TPlus = "MATH_PLUS";
        public readonly string TMinus = "MATH_MINUS";
        public readonly string TMultiply = "MATH_MULTIPLY";
        public readonly string TDivide = "MATH_DIVIDE";
        public readonly string TLParen = "L_PAREN";
        public readonly string TRParen = "R_PAREN";
        public readonly string TNewline = "NLC_NEWLINE";
        public readonly string TEOF = "EOF";
        public readonly string TError = "ERROR";
    }
}
