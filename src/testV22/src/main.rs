use testv22::parser::*;

fn main() {
    let mut code_test = "
    func print(a, b, c) {
        var calc = (a + b * c - 5);
        var hello = \"Hello World!\";
    }
    ".parser_iter();

    let ast = code_test.ast()
                                    .unwrap();

    println!("{:#?}", ast);
}
