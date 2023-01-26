using v8.backend.lexer.types;

namespace v8tests.defaultTypes
{
    public class TypePlusMathOperator 
    {
        MathOperator MathOp = new MathOperator("+");

        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void IsMathOp()
        {
            Assert.That(
                MathOp.Rule("+"),
                Is.EqualTo(true)
            );
        }

        [Test]
        public void IsNotMathOp()
        {
            Assert.That(
                MathOp.Rule("0"),
                Is.EqualTo(false)
            );
        }
    }
}