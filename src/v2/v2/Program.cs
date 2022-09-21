/*

                    Dryad Programing Language
                    =========================
                    Version prototype v2.0
                    =========================
                    license: MIT 

*/

using System;
using v2.back;
using v2.objects;
using v2.tools;


namespace v2
{
    internal class Program
    {
        private static void Main(string[] args)
        {
            FileReader fileReader;
            Tokenizer tokenizer;
            List<Token> tokens = new List<Token>();
            
            string input = new("");

            Console.WriteLine("Welcome to the Dryad");
            Console.WriteLine("help - for help");
            while (true)
            {
                Console.Write(">> ");
                input = Console.ReadLine();

                if (input == "help")
                {
                    Console.WriteLine("help - for help");
                    Console.WriteLine("exit - for exit");
                    Console.WriteLine("run - for run");
                }
                else if (input.StartsWith("dryad"))
                {
                    try
                    {
                        fileReader = new FileReader();
                        tokenizer = new Tokenizer(fileReader.ReadFile(input.Substring(6)));
                        tokens = tokenizer.Tokenize();
                        Console.WriteLine("Tokens:");
                        foreach (var token in tokens)
                        {
                            Console.WriteLine(token.type + " - " + token.value);
                        }
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e.Message);
                    }
                }
                else if (!string.IsNullOrEmpty(input))
                {
                    try
                    {
                        tokenizer = new Tokenizer(input);
                        tokens = tokenizer.Tokenize();
                        for (int i = 0; i < tokens.Count; i++)
                        {
                            Console.WriteLine("Type: " + tokens[i].type + " " + "Value: " + tokens[i].value);
                        }
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e.Message);
                    }
                }
                else if (input == "exit")
                {
                    break;
                }
            }
        }
    }
}
