using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using v8.backend.lexer;

namespace v8.backend.analyzer
{
public class SourceCode
{
    private List<string> lines;

    public SourceCode(string? source)
    {
        // Split the source code into lines and store them in a list
        if(!String.IsNullOrEmpty(source))
        {
            lines = source.Split(new[] { Environment.NewLine }, StringSplitOptions.None).ToList();  
        }
        else
        {
            lines = new List<string>();
        }
    }

    public string? GetLine(int lineNumber)
    {
        // Return the line data for the specified line number
        if (lineNumber >= 1 && lineNumber <= lines.Count)
        {
            return lines[lineNumber - 1];
        }
        return null;
    }
    public (int line, string? lineData) FindToken(Token token)
    {
        // Search for the line number and line data that contains the given token
        for (int lineNumber = 1; lineNumber <= lines.Count; lineNumber++)
        {
            string lineData = lines[lineNumber - 1];
            if (lineData.Contains(token.value))
            {
                int columnNumber = lineData.IndexOf(token.value) + 1;
                return (lineNumber, lineData);
            }
        }
        return (-1, null);
    }
}
}
