

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace v2.objects
{
    public class Info
    {
        public int line { get; set; }
        public int colum { get; set; }
        public int position { get; set; }

        public void SetLine(int line)
        {
            this.line = line;
        }

        public void SetColum(int col)
        {
            this.colum = col;
        }

        public void SetPosition(int position)
        {
            this.position = position;
        }

        public void IncrementLine()
        {
            this.line++;
        }

        public void IncrementColum()
        {
            this.colum++;
        }

        public void IncrementPosition()
        {
            this.position++;
        }
    }
}
