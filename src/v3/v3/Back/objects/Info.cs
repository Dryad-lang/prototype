namespace v3.back.objects
{
    public class Info
    {
        public int line { get; set; }
        public int colum { get; set; }
        public int position { get; set;}

        public Info(int _line, int _colum, int _position)
        {
            this.line = _line;
            this.colum = _colum;
            this.position = _position;
        }
    }
}