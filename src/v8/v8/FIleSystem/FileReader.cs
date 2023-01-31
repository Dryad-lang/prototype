using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace v8.FIleSystem
{
    // Use theading task for read the file and kill the task after return
    public class FileReader
    {
        public static Task<string> ReadFileAsync(string path)
        {
            return Task.Run(() => System.IO.File.ReadAllText(path));
        }
    }
}
