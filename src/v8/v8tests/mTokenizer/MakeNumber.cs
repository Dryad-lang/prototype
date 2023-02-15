using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using v8.backend.lexer;

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
            Token token = new Token(
                "test",
                "123",
                0,
                0,
                0,
                8,
                8,
                "file.dyd",
                "int a = 0;",
                new Character("0")
            );
            Token result = MakeNumber.Make(token);

            Assert.That(result.type, Is.EqualTo("INTEGER"));
        }

        [Test]
        public void TestMakeNumberFLOAT()
        {
            Token token = new Token(
                "test",
                "12.3",
                0,
                0,
                0,
                8,
                8,
                "file.dyd",
                "int a = 0;",
                new Character("0")
            );
            Token result = MakeNumber.Make(token);

            Assert.That(result.type, Is.EqualTo("FLOAT"));
        }
    }
}
