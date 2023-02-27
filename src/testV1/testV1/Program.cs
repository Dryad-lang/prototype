using System;
using GoldEngine;

namespace ExemploGOLDParser
{
    class Program
    {
        static void Main(string[] args)
        {
            Parser parser = new Parser();
            parser.Open("mathGramar.egt"); // substitua "gramatica_calculadora.grm" pelo nome do seu arquivo .grammar
            
            while (true)
            {
                Console.Write("> ");
                string input = Console.ReadLine();
                if (input.ToLower() == "quit") break;

                ParseMessage parseMessage = parser.ParseString(input);

                if (parseMessage.IsAccepted)
                {
                    double resultado = AvaliarExpressao(parseMessage);
                    Console.WriteLine("Resultado: " + resultado);
                }
                else
                {
                    Console.WriteLine("Expressão inválida");
                }
            }

            parser.Close();
        }

        static double AvaliarExpressao(ParseMessage parseMessage)
        {
            double resultado = 0;

            if (parseMessage.ParserOutput.Messages.Count == 0)
            {
                ParseTreeNode rootNode = parseMessage.ParserOutput.ParseTree.Root;

                if (rootNode.Term.Name == "expressao")
                {
                    resultado = AvaliarNo(rootNode.ChildNodes[0]);
                }
            }

            return resultado;
        }

        static double AvaliarNo(ParseTreeNode no)
        {
            double resultado = 0;

            switch (no.Term.Name)
            {
                case "expressao":
                    resultado = AvaliarNo(no.ChildNodes[0]);
                    break;
                case "termo":
                    resultado = AvaliarNo(no.ChildNodes[0]);
                    for (int i = 1; i < no.ChildNodes.Count; i += 2)
                    {
                        switch (no.ChildNodes[i].Token.Text)
                        {
                            case "+":
                                resultado += AvaliarNo(no.ChildNodes[i + 1]);
                                break;
                            case "-":
                                resultado -= AvaliarNo(no.ChildNodes[i + 1]);
                                break;
                        }
                    }
                    break;
                case "fator":
                    resultado = AvaliarNo(no.ChildNodes[0]);
                    for (int i = 1; i < no.ChildNodes.Count; i += 2)
                    {
                        switch (no.ChildNodes[i].Token.Text)
                        {
                            case "*":
                                resultado *= AvaliarNo(no.ChildNodes[i + 1]);
                                break;
                            case "/":
                                resultado /= AvaliarNo(no.ChildNodes[i + 1]);
                                break;
                            case "%":
                                resultado %= AvaliarNo(no.ChildNodes[i + 1]);
                                break;
                            case "//":
                                resultado = Math.Floor(resultado / AvaliarNo(no.ChildNodes[i + 1]));
                                break;
                            case "^":
                                resultado = Math.Pow(resultado, AvaliarNo(no.ChildNodes[i + 1]));
                                break;
                        }
                    }
                    break;
                case "numero":
                    resultado = double.Parse(no.Token.Text);
                    break;
                case "variavel":
                    // Adicione aqui a lógica para obter o valor da variável
                    break;
            }

            return resultado;
        }
    }
}
