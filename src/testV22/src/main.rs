use testv22::parser::*;

fn main() {
    let mut code_test = "
    func print(a: int, b: uint, c: uint) : int {
        var calc: int = (a + b * c - 5);
        var hello: str = \"Hello World!\";
    }

    if(a < 5 && a > 0 || c == 3) {
        var c: int = -5;
    } else {
        var c: int = 5;
    }

    while (a < 5 && a > 0 || c == 3 && z >= -1) {
        var calc: int = (a + b * c - 5);
        const hello: str = \"Hello World!\";
    }
    "
    .parser_iter();

    let ast = code_test.ast().unwrap();

    println!("{:#?}", ast);
}
