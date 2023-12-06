use testv22::parser::*;

fn main() {
    let mut code_test = "var hello = 5;\nvar world = -6;\nvar test = \"Hello!\";".parser_iter();

    let ast = code_test.ast().unwrap();

    println!("{:#?}", ast);
}
