namespace v8tests.defaultTypes
{
    public class TypeCharacter
    {
        v8.backend.lexer.types.Character CharVal = new v8.backend.lexer.types.Character("0");

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