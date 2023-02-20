using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using v8.backend.lexer;

namespace v8.backend.Errors
{
    public interface IGenericError
    {
        IGenericError GetException();
        
    }
}
