using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace v2.objects
{
    public class Token
    {
        public string type { get; }
        public string value { get; }
        public Info info { get; }

        public Token(string type, string value, Info info)
        {
            this.type = type;
            this.value = value;
            this.info = info;
        }
    }
}
