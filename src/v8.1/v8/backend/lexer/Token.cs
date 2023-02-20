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
        public Types type;
        public string value;
        public int index;
        public int colum;
        public int line;
        public int PosStart;
        public int PosEnd;
        public string file;

        public Token(Types type, string value, int index, int colum, int line, int PosStart, int PosEnd, string file)
        {
            this.type = type;
            this.value = value;
            this.index = index;
            this.colum = colum;
            this.line = line;
            this.PosStart = PosStart;
            this.PosEnd = PosEnd;
            this.file = file;
        }

        public static Token EmptyToken()
        {
            return new Token(Types.TREE_ROOT , "", 0, 0, 0, 0, 0, "");
        }
    }
}