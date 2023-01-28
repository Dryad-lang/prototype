using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace v8tests.defaultTypes
{
    public class TypeString
    {
        v8.backend.lexer.types.String StringVal = new v8.backend.lexer.types.String("0");

        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void TestIsString()
        {
            Assert.That(
                StringVal.Rule("a1"),
                Is.EqualTo(true)
            );
        }

        [Test]
        public void TestIsNotString()
        {
            Assert.That(
                StringVal.Rule("1"),
                Is.EqualTo(false)
            );
        }
    }
}
