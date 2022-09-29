namespace v3.front
{
    public class Command
    {
        private string _name = "";
        private List<string> _args = new List<string>();
        private string _raw = "";

        public Command SetCommand(string rawcommand)
        {
            string[] split = rawcommand.Split(' ');
            _name = split[0];
            _args = split.Skip(1).ToList();
            _raw = rawcommand;
            return this;
        }

        public void Run()
        {
            switch (_name)
            {
                case "help":
                    Console.WriteLine("Available commands:");
                    Console.WriteLine("exit");
                    Console.WriteLine("help");
                    break;
                case "echo":
                    Console.WriteLine(string.Join(" ", _args));
                    break;
                case "dryad":
                    return;
                    // Here is the read file command
                default:
                    /*
                    Here is just execute the raw command
                    Explaination:
                    This is the shell for the language so if not have imput 
                    just execute how if this is a lines of code
                    just how python or nodejs compiler/cli

                    Example:
                    imput: 1 + 1
                    return: <compiled process>
                    */
                    break;
            }
        }
    }
}