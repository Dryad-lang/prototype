using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using v8.backend.Errors;
using v8.backend.lexer;

namespace v8tests.Errors
{
    public class TestErrorUtils
    {
        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void TestStringWithArrows()
        {
            string expected = "int i = 0;"+ '\n' + "^^^";

            string actual = ErrorUtils.StringWithArrows("int i = 0;", 0, 2);

            Assert.That(actual, Is.EqualTo(expected));
        }
    }

    public class TestTraceback
    {
        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void TestAddError()
        {
            Traceback traceback = new Traceback();

            Token token = new Token("test", "test", 0, 0, 0, 8, 8, "file.dyd", "int a = «", new Character("«"));

            IllegalCharError error = new IllegalCharError(token);

            traceback.AddError(error);

            Assert.That(traceback.Errors.Count, Is.EqualTo(1));
        }

        [Test]
        public void TestThrow()
        {
            Traceback traceback = new Traceback();

            Token token = new Token("test", "test", 0, 0, 0, 8, 8, "file.dyd", "int a = «", new Character("«"));

            IllegalCharError error = new IllegalCharError(token);

            traceback.AddError(error);
            traceback.AddError(error);
            traceback.AddError(error);

            Assert.Throws<Exception>(() => traceback.Throw());
        }
    }
}
