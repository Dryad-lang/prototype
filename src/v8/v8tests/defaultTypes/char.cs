using v8.backend.lexer.types;

namespace v8tests.defaultTypes
{
    public class TypeCharacter
    {
        Character CharVal = new Character("0");

        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void TestIsChar()
        {
            Assert.That(
                CharVal.Rule("a"),
                Is.EqualTo(true)
            );
        }

        [Test]
        public void TestIsNotChar()
        {
            Assert.That(
                CharVal.Rule("1.0"),
                Is.EqualTo(false)
            );
        }
    }
}