use testv22::parser::*;

fn main() {
    let mut code_test = "
    func print(a, b, c) {
        var calc = (a + b * c - 5);
        var hello = \"Hello World!\";
    }

    if(a < 5 && a > 0 || c == 3) {
        var c = -5;
    } else {
        var c = 5;
    }

    while (a < 5 && a > 0 || c == 3 && z >= -1) {
        var calc = (a + b * c - 5);
        const hello = \"Hello World!\";
    }
    ".parser_iter();

    let ast = code_test.ast()
                                    .unwrap();

    println!("{:#?}", ast);
}
