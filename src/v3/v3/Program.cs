using v3.back;
using v3.front;
namespace v3
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Shell shell = new Shell();
            if (args.Length == 0)
            {
                shell.Run(null);
            }
            else
            {
                shell.Run(args[0]);
            }
        }
    }
}