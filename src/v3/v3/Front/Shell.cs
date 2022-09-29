namespace v3.front
{
    public class Shell
    {
        public Command command = new Command();
        public void Run(string paramImput)
        {
            Console.WriteLine("Welcome to the v3 shell!");
            Console.WriteLine("Type 'exit' to exit.");
            while (true)
            {
                string? imput = Console.ReadLine();
                Console.Write(">> ");
                if (imput == "exit")
                {
                    break;
                }
                else if (!string.IsNullOrEmpty(imput))
                {
                    command.SetCommand(imput).Run();
                }
            }
        }
    }
}