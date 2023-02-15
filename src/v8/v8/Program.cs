using v8.backend.Errors;
using v8.backend.lexer;
using v8.backend.lexer.types;

namespace v8
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            /*
                         var token = new Token("test", "test", 0, 0, "file.dyd", "int i = «;", new Character("«"));

            var error = new IllegalCharError(9, 9, "Invalid character", token);

            var traceback = new Traceback();

            traceback.AddError(error);

            try{
                traceback.Throw();
            }catch(Exception e){
                System.Console.WriteLine(e.Message);
            }
             */

            Console.WriteLine("'" + ErrorUtils.StringWithArrows("int i = 0;", 0, 2)+ "'");
        }
    }
}