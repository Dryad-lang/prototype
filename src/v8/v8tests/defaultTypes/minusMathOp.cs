using v8.backend.lexer.types;

namespace v8tests.defaultTypes
{
    public class TypeMinusMathOperator 
    {
        MinusMathOperator minusMathOp;

        [SetUp]
        public void Setup()
        {
            minusMathOp = new MinusMathOperator("+");
        }

        [Test]
        public void TestIsPlus()
        {
            Assert.That(
                minusMathOp.Rule("-"),
                Is.EqualTo(true)
            );
        }

        [Test]
        public void TestIsNotPlus()
        {
            Assert.That(
                minusMathOp.Rule("0"),
                Is.EqualTo(false)
            );
        }
    }
}