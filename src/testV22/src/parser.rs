pub mod tokens;

use self::tokens::Token;

use super::tokenizer::{Tokenizer, TokenizerIterator};

pub struct ParserIterator<'a> {
    tokenizer: TokenizerIterator<'a>,
}

impl<'a> ParserIterator<'a> {
    pub fn get_tokens(&mut self) -> Vec<Token> {
        self.tokenizer.by_ref()
                      .collect()
    }
}

pub trait Parser<'a> {
    fn parser_iter(self) -> ParserIterator<'a>;
}

impl<'a> Parser<'a> for &'a str {
    fn parser_iter(self) -> ParserIterator<'a> {
        ParserIterator {
            tokenizer: self.tokenizer_iter()
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parser_basics() {
        let source: String = "print(\"Hello World!\");\nif(x < 10) { print(\"x is lesser than 10\") } else { print(\"x is greater than 10\") } ".into();

        let mut parser = source.parser_iter();

        let tokens: Vec<Token> = parser.get_tokens();

        println!("{:#?}", tokens);
    }
}