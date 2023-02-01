using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace v8.FIleSystem
{
    public class FileReader
    {
        public Task<string> ReadAsync(string path)
        {
            return Task.Run(() =>
            {
                return System.IO.File.ReadAllText(path);
            });
        }
    }
}
