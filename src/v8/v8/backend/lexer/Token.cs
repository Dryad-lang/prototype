    /*
    What shoud token contains
    1. Type
    2. Value
    3. Line
    4. Colum
    5. Position
    7. File
    8. Group -> Math expresions, Objects, Procedures
    */
using v8.backend.lexer.types;
namespace v8.backend.lexer
{
    public class Token
    {
        public string type;
        public string value;
        public int index;
        public int colum;
        public string file;
        public string line;
        public IGenericType group;

        public Token(string type, string value, int index, int colum, string file, string line, IGenericType group)
        {
            this.type = type;
            this.value = value;
            this.index = index;
            this.colum = colum;
            this.file = file;
            this.line = line;
            this.group = group;
        }
    }
}