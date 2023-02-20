using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using v8.backend.lexer;
using v8.backend.analyzer;
using v8.backend.lexer.types;

namespace v8tests.mTokenizer
{
    public class TestMakeNumber
    {
        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void TestMakeNumberINT()
        {
            SourceCode src = new SourceCode("int i = 0;");
            Token token = new Token(
                Types.INTEGER_TYPE,
                "123",
                0,
                0,
                0,
                8,
                8,
                "file.dyd"
            );
            Token result = MakeNumber.Make(token, src);

            Assert.That(result.type, Is.EqualTo("INTEGER"));
        }

        [Test]
        public void TestMakeNumberFLOAT()
        {
            SourceCode src = new SourceCode("int i = 0;");
            Token token = new Token(
                Types.FLOAT_TYPE,
                "12.3",
                0,
                0,
                0,
                8,
                8,
                "file.dyd"
            );
            Token result = MakeNumber.Make(token, src);

            Assert.That(result.type, Is.EqualTo("FLOAT"));
        }
    }
}
