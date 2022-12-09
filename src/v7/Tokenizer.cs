using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace v7
{
    public class Token
    {
        string? token { get; set; }
        string? value { get; set; }
        int pos { get; set; }
        int line { get; set; }
        int colum { get; set; }
    }

    public class Types
    {
        Dictionary<string, string> dictionary = new();

        void GetType()
        {
        }
    }
}
