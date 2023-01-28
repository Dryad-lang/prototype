namespace v8tests.defaultTypes
{
    public class TypeBoolean
    {
        v8.backend.lexer.types.Boolean BoolVal = new v8.backend.lexer.types.Boolean("0");

        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void TestIsBoolean()
        {
            Assert.That(
                BoolVal.Rule("true"),
                Is.EqualTo(true)
            );
        }

        [Test]
        public void TestIsNotBoolean()
        {
            Assert.That(
                BoolVal.Rule("1"),
                Is.EqualTo(false)
            );
        }

        [Test]
        public void TestIsTrue()
        {
            bool result = BoolVal.Rule("true");
            Assert.That(
                result,
                Is.EqualTo(true)
            );
        }

        [Test]
        public void TestIsFalse()
        {
            bool result = BoolVal.Rule("false");
            Assert.That(
                result,
                Is.EqualTo(true)
            );
        }
    }
}
