using System.IO;
using v3.back.objects;

namespace v3.front
{
    public class FileReader
    {
        public string ReadFile(string path)
        {
            ErrorHandler errorHandler = new ErrorHandler();
            if (Path.GetExtension(path) != ".dyd")
            {
                errorHandler
                .SetType(ErrorType.RuntimeError)
                .SetMessage("Unable to read file the file extension cannot be read.")
                .ThrowError();
            }
            else if (!File.Exists(path))
            {
                errorHandler
                .SetType(ErrorType.RuntimeError)
                .SetMessage("Unable to read file the file does not exist.")
                .ThrowError();
            }
            else if (File.ReadAllText(path) == "")
            {
                errorHandler
                .SetType(ErrorType.RuntimeError)
                .SetMessage("Unable to read file the file is empty.")
                .ThrowError();
            }
            else
            {
                return File.ReadAllText(path);
            }
            return "";
        }
    }
}