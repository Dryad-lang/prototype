using v8.FIleSystem;

namespace v8tests.fileSystem
{
    public class Tests
    {
        FileReader reader = new FileReader();
        [SetUp]
        public void Setup()
        {

        }

        [Test]
        public void ReadFile()
        {
            // Get dinamicaly path from bin of the test rep
            string path = System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "file.txt");

            // Create file
            System.IO.File.WriteAllText(path, "Hello, World!");

            // Read file
            string result = reader.ReadAsync(path).Result;

            // Delete file
            System.IO.File.Delete(path);

            // Assert
            Assert.That(result, Is.EqualTo("Hello, World!"));
        }
    }
}
