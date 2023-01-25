using v8.backend.lexer.types;

namespace v8tests.defaultTypes
{
    public class TypeInteger
    {
        Integer IntVal;

        [SetUp]
        public void Setup()
        {
            IntVal = new Integer("1");
        }

        [Test]
        public void Test1()
        {
            Assert.That(
                IntVal.Rule("1"),
                Is.EqualTo(true)
            );
        }
    }
}