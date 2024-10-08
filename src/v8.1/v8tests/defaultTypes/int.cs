﻿namespace v8tests.defaultTypes
{
    public class TypeInteger
    {
        v8.backend.lexer.types.Integer IntVal = new v8.backend.lexer.types.Integer("0");

        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void TestIsInteger()
        {
            Assert.That(
                IntVal.Rule("1"),
                Is.EqualTo(true)
            );
        }

        [Test]
        public void TestIsNotInteger()
        {
            Assert.That(
                IntVal.Rule("1.0"),
                Is.EqualTo(false)
            );
        }

        
        [Test]
        public void TestIsNegative()
        {
            IntVal.Rule("-1");
            bool result = IntVal.getIsNegative();
            Assert.That(
                result,
                Is.EqualTo(true)
            );
        }
    }
}