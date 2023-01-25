using v8.backend.lexer.types;

namespace v8tests.defaultTypes
{
    public class TypePlusMathOperator 
    {
        PlusMathOperator plusMathOp;

        [SetUp]
        public void Setup()
        {
            plusMathOp = new PlusMathOperator("+");
        }

        [Test]
        public void TestIsPlus()
        {
            Assert.That(
                plusMathOp.Rule("+"),
                Is.EqualTo(true)
            );
        }

        [Test]
        public void TestIsNotPlus()
        {
            Assert.That(
                plusMathOp.Rule("0"),
                Is.EqualTo(false)
            );
        }
    }
}