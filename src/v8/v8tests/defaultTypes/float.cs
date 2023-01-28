namespace v8tests.defaultTypes
{
    public class TypeFloat
    {
        v8.backend.lexer.types.Float FloatVal = new v8.backend.lexer.types.Float("0");

        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void TestIsFloat()
        {
            Assert.That(
                FloatVal.Rule("1.0"),
                Is.EqualTo(true)
            );
        }

        [Test]
        public void TestIsNotFloat()
        {
            Assert.That(
                FloatVal.Rule("1"),
                Is.EqualTo(false)
            );
        }

        
        [Test]
        public void TestIsNegative()
        {
            FloatVal.Rule("-1.0");
            bool result = FloatVal.getIsNegative();
            Assert.That(
                result,
                Is.EqualTo(true)
            );
        }
    }
}