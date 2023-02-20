// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Text;
// using System.Threading.Tasks;
// using v8.backend.analyzer;

// namespace v8tests.Analyzer
// {
//     public class TestTraceStack
//     {
//         [SetUp]
//         public void Setup()
//         {
//         }

//         [Test]
//         public void TestWrite()
//         {
//             TraceStack trace = new TraceStack();
//             trace.Write("test");
//             Assert.That(trace.Read()[1], Is.EqualTo("test"));
//         }

//         [Test]
//         public void TestRead()
//         {
//             TraceStack trace = new TraceStack();
//             trace.Write("test");
//             Assert.That(trace.Read()[1], Is.EqualTo("test"));
//         }

//         [Test]
//         public void TestClear()
//         {
//             TraceStack trace = new TraceStack();
//             trace.Write("test");
//             trace.Clear();
//             Assert.That(trace.Read().Count, Is.EqualTo(0));
//         }

//         [Test]
//         public void TestReadAndClear()
//         {
//             TraceStack trace = new TraceStack();
//             trace.Write("test");
//             Assert.That(trace.ReadAndClear().Count, Is.EqualTo(0));
//         }
//     }
// }
