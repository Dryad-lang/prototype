using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace v8.backend.lexer.Tokenizer
{
    interface ITokenizer
    {
        /*
        This is the interface for tokenizers
        
        Tha language use multiples compilers for do diferent jobs
        - M -> Math Expressions
        - P -> Procedures
        - O -> Objects

        Due to this the intepreter need 3 types of tokenizers and
        then need to work togueder 
        */ 

        // This method will see if the imput is on the rules of the tokenizer
        bool IsMatch(string input);
    }
}
