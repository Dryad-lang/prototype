namespace v3.front
{
    public class Shell
    {
        public void Run()
        {
            Console.WriteLine("Welcome to the v3 shell!");
            Console.WriteLine("Type 'exit' to exit.");
            while (true)
            {
                Console.Write("v3> ");
                string input = Console.ReadLine();
                if (input == "exit")
                {
                    break;
                }
                else
                {
                    Console.WriteLine("You typed: " + input);
                }
            }
        }
    }
}