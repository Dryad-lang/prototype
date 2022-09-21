using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using v2.objects;

namespace v2.tools
{
    public class FileReader
    {
        public string ReadFile(string path)
        {
            string text = "";
            if (path.EndsWith(".dyd"))
            {
                text = System.IO.File.ReadAllText(path);
            }
            else
            {
                Console.WriteLine("Can't read file");
            }
            return text;
        }
    }
}