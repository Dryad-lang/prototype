using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using v8.backend.analyzer;

namespace v8tests.Analyzer
{
    public class TestSourceCode
    {
        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void TestGetLine()
        {
            string sourceCode = 
            @"function sum(a, b)
            {
                return a + b;
            };";

            SourceCode source = new SourceCode(sourceCode);

            Assert.That(source.GetLine(1), Is.EqualTo("function sum(a, b)"));
        }

        [Test]
        public void TestGetLine2()
        {
            string sourceCode = 
            @"function sum(a, b)
{
return a + b;
};";

            SourceCode source = new SourceCode(sourceCode);

            Assert.That(source.GetLine(2), Is.EqualTo("{"));
        }
    }
}
