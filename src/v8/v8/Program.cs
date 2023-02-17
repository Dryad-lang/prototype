using v8.backend.Errors;
using v8.backend.lexer;
using v8.backend.lexer.types;
using System.Collections.Generic;

namespace v8
{
    

    public class NodoAST
    {
        public string tipo;
        public string valor;
        public List<NodoAST> filhos;

        public NodoAST(string tipo, string valor)
        {
            this.tipo = tipo;
            this.valor = valor;
            this.filhos = new List<NodoAST>();
        }
    }

    public class AST
    {
        public NodoAST raiz;

        public AST(NodoAST raiz)
        {
            this.raiz = raiz;
        }
    }

    public class Program
    {
        static void Main(string[] args)
        {
            // Criar nó raiz para representar o procedimento "Soma"
            NodoAST raiz = new NodoAST("procedimento", "Soma");

            // Criar nó para representar o tipo de retorno do procedimento
            NodoAST tipoRetorno = new NodoAST("tipo", "int");
            raiz.filhos.Add(tipoRetorno);

            // Criar nó para representar o primeiro parâmetro "a"
            NodoAST parametroA = new NodoAST("parametro", "a");
            NodoAST tipoParametroA = new NodoAST("tipo", "int");
            parametroA.filhos.Add(tipoParametroA);
            raiz.filhos.Add(parametroA);

            // Criar nó para representar o segundo parâmetro "b"
            NodoAST parametroB = new NodoAST("parametro", "b");
            NodoAST tipoParametroB = new NodoAST("tipo", "int");
            parametroB.filhos.Add(tipoParametroB);
            raiz.filhos.Add(parametroB);

            // Criar nó para representar a declaração da variável "resultado"
            NodoAST declaracaoResultado = new NodoAST("declaracao", "resultado");
            NodoAST tipoResultado = new NodoAST("tipo", "int");
            declaracaoResultado.filhos.Add(tipoResultado);
            raiz.filhos.Add(declaracaoResultado);

            // Criar nó para representar a atribuição da variável "resultado"
            NodoAST atribuicaoResultado = new NodoAST("atribuicao", "=");
            NodoAST variavelResultado = new NodoAST("variavel", "resultado");
            NodoAST soma = new NodoAST("operador", "+");
            NodoAST variavelA = new NodoAST("variavel", "a");
            NodoAST variavelB = new NodoAST("variavel", "b");
            soma.filhos.Add(variavelA);
            soma.filhos.Add(variavelB);
            atribuicaoResultado.filhos.Add(variavelResultado);
            atribuicaoResultado.filhos.Add(soma);
            raiz.filhos.Add(atribuicaoResultado);

            // Criar nó para representar o retorno do valor "resultado"
            NodoAST retornoResultado = new NodoAST("retorno", "resultado");
            raiz.filhos.Add(retornoResultado);

            // Criar a AST a partir do nó raiz
            AST ast = new AST(raiz);
        }
    }

}