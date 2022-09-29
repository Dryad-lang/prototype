namespace v3.front
{
    public class fileReader
    {
        public string ReadFile(string path)
        {
            string file = File.ReadAllText(path);
            return file;
        }
    }
}