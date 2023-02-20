namespace v8tests.defaultTypes
{
    public class TypePlusMathOperator 
    {
        v8.backend.lexer.types.MathOperator MathOp = new v8.backend.lexer.types.MathOperator("+");

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