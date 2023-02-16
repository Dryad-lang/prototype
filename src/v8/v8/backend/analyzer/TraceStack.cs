using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace v8.backend.analyzer
{
    public class TraceStack
    {

        // Get the path to the app.exe
        private string traceFile = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location) + "\\trace.txt";

        public TraceStack()
        {
            // Try catch and close process
            try
            {
                using (StreamWriter sw = File.CreateText(traceFile))
                {
                    sw.WriteLine("Trace file created");
                }
            }
            catch (Exception e)
            {
                throw new Exception("Error while creating trace file: " + e.Message);
            }
        }

        public void Write(string line)
        {
            // Try catch and close process
            try
            {
                using (StreamWriter sw = File.AppendText(traceFile))
                {
                    sw.WriteLine(line);
                }
            }
            catch (Exception e)
            {
                throw new Exception("Error while writing to trace file: " + e.Message);
            }
        }

        public List<string> Read()
        {
            List<string> lines = new List<string>();
            // Try catch and close process
            try
            {
                using (StreamReader sr = File.OpenText(traceFile))
                {
                    string? s = String.Empty;
                    while ((s = sr.ReadLine()) != null)
                    {
                        lines.Add(s);
                    }
                }
            }
            catch (Exception e)
            {
                throw new Exception("Error while reading from trace file: " + e.Message);
            }
            return lines;
        }

        public void Clear()
        {
            try
            {
                using (FileStream stream = File.Open(traceFile, FileMode.Open))
                {
                    File.Delete(traceFile);
                }
            }
            catch(Exception e)
            {
                throw new Exception("Error while deleting trace file." + e.ToString());
            }
        }

        public List<string> ReadAndClear()
        {
            List<string> lines = Read();
            Clear();
            return lines;
        }
    }
}



