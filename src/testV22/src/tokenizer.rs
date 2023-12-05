use std::iter::{Iterator, Peekable};

use super::parser::tokens::{Token, TokenType};

pub struct TokenizerIterator<'a> {
    // source: String,
    source_iter: Peekable<Box<dyn Iterator<Item = char> + 'a>>,
    line: usize,
    column: usize,
}

impl<'a> TokenizerIterator<'a> {

    #[inline]
    pub fn lex_pairs(&mut self) -> Option<Token> {
        let c = self.source_iter.next()
                                      .unwrap();

        self.column += 1;

        let token = Token {
            token_type: match c {
                '(' => TokenType::LxLParen,
                ')' => TokenType::LxRParen,
                '[' => TokenType::LxLBracket,
                ']' => TokenType::LxRBracket,
                '{' => TokenType::LxLCurly,
                '}' => TokenType::LxRCurly,

                _ => unreachable!(),
            },
            lexeme: c.to_string(),
            line: self.line,
            column: self.column,
        };

        Some(token)
    }

    #[inline]
    pub fn lex_spaces(&mut self) -> Option<Token> {
        while let Some(c) = self.source_iter.by_ref().peek() {
            match *c {
                ' ' | '\t' => { self.source_iter.by_ref().next(); self.column += 1;},

                _ => break,
            }
        }

        self.next()
    }

    #[inline]
    pub fn lex_newline(&mut self) -> Option<Token> {
        while let Some(c) = self.source_iter.by_ref().peek() {
            if *c == '\n' {
                self.source_iter.by_ref()
                                .next(); 
                self.line += 1;
            } else {
                break;
            }
        }
        
        self.column = 1;

        self.next()
    }

    #[inline]
    pub fn lex_number(&mut self) -> Option<Token> {
        let mut lexeme: String = String::new();

        'outer:
        while let Some(c) = self.source_iter.by_ref().peek() {
            if (*c).is_digit(10) {
                self.column += 1;
                lexeme.push(self.source_iter.by_ref().next().unwrap());
            } else if *c == '.' {
                lexeme.push(self.source_iter.by_ref().next().unwrap());
                while let Some(c) = self.source_iter.by_ref().peek() {
                    if (*c).is_digit(10) {
                        self.column += 1;
                        lexeme.push(self.source_iter.by_ref().next().unwrap());
                    } else {
                        break 'outer;
                    }
                }
            } else {
                break;
            }
        }

        let token = Token {
            token_type: TokenType::LxNumber,
            lexeme,
            line: self.line,
            column: self.column,
        };

        Some(token)
    }

    #[inline]
    pub fn lex_alphanum(&mut self) -> Option<Token> {
        let mut lexeme: String = String::new();

        while let Some(c) = self.source_iter.by_ref().peek() {
            if (*c).is_alphabetic() {
                lexeme.push(self.source_iter.by_ref().next().unwrap());
                self.column += 1;
            } else {
                break;
            }
        }

        let token = Token::new_from_lexeme(lexeme, self.line, self.column);

        Some(token)
    }

    #[inline]
    pub fn lex_string(&mut self) -> Option<Token> {
        let mut lexeme: String = String::new();

        self.source_iter.by_ref().next().unwrap();
        self.column += 1;
        while let Some(c) = self.source_iter.by_ref().peek() {
            if *c != '"' {
                lexeme.push(self.source_iter.by_ref().next().unwrap());
                self.column += 1;
            } else {
                self.source_iter.by_ref().next().unwrap();
                self.column += 1;
                break;
            }
        }

        let token = Token::new(TokenType::LxString, lexeme, self.line, self.column);

        Some(token)
    }

    #[inline]
    pub fn lex_punct(&mut self) -> Option<Token> {
        let c = self.source_iter.by_ref().next().unwrap();

        let token_type = match c {
            ';' => TokenType::LxSemiColon,
            ':' => TokenType::LxColon,
            ',' => TokenType::LxComma,
            '.' => TokenType::LxDot,

            _ => unreachable!(),
        };

        self.column += 1;

        let token = Token::new(token_type, c.to_string(), self.line, self.column);

        Some(token)
    }

    #[inline]
    pub fn lex_logic(&mut self) -> Option<Token> {
        let c = self.source_iter.by_ref().next().unwrap();
        self.column += 1;

        let mut lexeme: String = String::new();

        lexeme.push(c);

        match c {
            '&' => if let Some(n) = self.source_iter.peek() { if *n == '&' { self.column += 1; lexeme.push(self.source_iter.by_ref().next().unwrap()); } },
            '|' => if let Some(n) = self.source_iter.peek() { if *n == '|' { self.column += 1; lexeme.push(self.source_iter.by_ref().next().unwrap()); } },
            '!' => if let Some(n) = self.source_iter.peek() { if *n == '=' { self.column += 1; lexeme.push(self.source_iter.by_ref().next().unwrap()); } },
            '=' => if let Some(n) = self.source_iter.peek() { if *n == '=' { self.column += 1; lexeme.push(self.source_iter.by_ref().next().unwrap()); } },
            '>' => if let Some(n) = self.source_iter.peek() { if *n == '=' { self.column += 1; lexeme.push(self.source_iter.by_ref().next().unwrap()); } },
            '<' => if let Some(n) = self.source_iter.peek() { if *n == '=' { self.column += 1; lexeme.push(self.source_iter.by_ref().next().unwrap()); } },
            '~' => {},

            _ => unreachable!(),
        };

        let token = Token::new_from_lexeme(lexeme, self.line, self.column);

        Some(token)
    }

    #[inline]
    pub fn lex_math(&mut self) -> Option<Token> {
        let c = self.source_iter.by_ref().next().unwrap();
        self.column += 1;

        let mut lexeme: String = String::new();

        lexeme.push(c);

        match c {
            '+' => if let Some(n) = self.source_iter.peek() { if *n == '+' { self.column += 1; lexeme.push(self.source_iter.by_ref().next().unwrap()); } },
            '-' => if let Some(n) = self.source_iter.peek() { if *n == '-' { self.column += 1; lexeme.push(self.source_iter.by_ref().next().unwrap()); } },
            '*' => if let Some(n) = self.source_iter.peek() { if *n == '*' { self.column += 1; lexeme.push(self.source_iter.by_ref().next().unwrap()); } },
            '/' => if let Some(n) = self.source_iter.peek() { if *n == '/' { self.column += 1; lexeme.push(self.source_iter.by_ref().next().unwrap()); } },

            _ => unreachable!()
        }

        let token = Token::new_from_lexeme(lexeme, self.line, self.column);

        Some(token)
    }
}

pub trait Tokenizer<'a> {
    fn tokenizer_iter(self) -> TokenizerIterator<'a>;
}

impl<'a> Tokenizer<'a> for &'a str {
    fn tokenizer_iter(self) -> TokenizerIterator<'a> {
        TokenizerIterator {
            // source: self.to_string(),
            source_iter: (Box::new(
                self.chars()
                    .into_iter()
                ) as Box<dyn Iterator<Item = char>>)
                .peekable(),
            line: 1,
            column: 0,
        }
    }
}

impl<'a> Iterator for TokenizerIterator<'a> {
    type Item = Token;

    #[inline]
    fn next(&mut self) -> Option<Self::Item> {
        let c = self.source_iter.peek();

        if let Some(c) = c {
            match *c {
                ' ' | '\t' => self.lex_spaces(),
                '\n' => self.lex_newline(),
                '(' | ')' | '[' | ']' | '{' | '}' => self.lex_pairs(),
                ';' | ':' | ',' | '.' => self.lex_punct(),
                '0'..='9' => self.lex_number(),
                'A'..='Z' | 'a'..='z' => self.lex_alphanum(),
                '"' => self.lex_string(),
                '&' | '|' | '!' | '~' | '=' | '<' | '>' => self.lex_logic(),
                '+' | '-' | '*' | '/' | '%' => self.lex_math(),

                _ => None
            }
        } else {
            None
        }
    }
}