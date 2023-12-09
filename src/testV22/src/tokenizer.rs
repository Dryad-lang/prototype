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
    pub(self) fn advance_char(&mut self) -> Option<char> {
        self.column += 1;

        self.source_iter.by_ref().next()
    }

    #[inline]
    pub(self) fn lex_pairs(&mut self) -> Option<Token> {
        let c = self.advance_char().unwrap();

        Some(self.emit_token(TokenType::from(c), Some(c.to_string())))
    }

    #[inline]
    pub(self) fn lex_spaces(&mut self) -> Option<Token> {
        while let Some(c) = self.source_iter.by_ref().peek() {
            if *c == ' ' || *c == '\t' {
                self.advance_char().unwrap();
            } else {
                break;
            }
        }

        self.next()
    }

    #[inline]
    pub(self) fn lex_newline(&mut self) -> Option<Token> {
        while let Some(c) = self.source_iter.by_ref().peek() {
            if *c == '\n' {
                self.source_iter.by_ref().next();
                self.line += 1;
            } else {
                break;
            }
        }

        self.column = 1;

        self.next()
    }

    #[inline]
    pub(self) fn lex_number(&mut self) -> Option<Token> {
        let mut lexeme: String = String::new();

        'outer: while let Some(c) = self.source_iter.by_ref().peek() {
            if (*c).is_digit(10) {
                lexeme.push(self.advance_char().unwrap());
            } else if *c == '.' {
                lexeme.push(self.advance_char().unwrap());
                while let Some(c) = self.source_iter.by_ref().peek() {
                    if (*c).is_digit(10) {
                        lexeme.push(self.advance_char().unwrap());
                    } else {
                        break 'outer;
                    }
                }
            } else {
                break;
            }
        }

        Some(self.emit_token(TokenType::LxNumber, Some(lexeme)))
    }

    #[inline]
    pub(self) fn lex_alphanum(&mut self) -> Option<Token> {
        let mut lexeme: String = String::new();

        while let Some(c) = self.source_iter.by_ref().peek() {
            if (*c).is_alphabetic() {
                let c = self.advance_char().unwrap();
                lexeme.push(c);
            } else {
                break;
            }
        }

        Some(Token::new_from_lexeme(lexeme, self.line, self.column))
    }

    #[inline]
    pub(self) fn lex_string(&mut self) -> Option<Token> {
        self.advance_char();

        let mut lexeme: String = String::new();

        while let Some(c) = self.source_iter.by_ref().peek() {
            if *c != '"' {
                lexeme.push(self.advance_char().unwrap());
            } else {
                break;
            }
        }

        self.advance_char();

        Some(self.emit_token(TokenType::LxString, Some(lexeme)))
    }

    #[inline]
    pub(self) fn lex_punct(&mut self) -> Option<Token> {
        let c = self.advance_char().unwrap();

        Some(self.emit_token(TokenType::from(c), Some(c.to_string())))
    }

    #[inline]
    pub(self) fn lex_logic(&mut self) -> Option<Token> {
        let c = self.advance_char().unwrap();

        Some(match c {
            '&' => {
                if let Some(n) = self.source_iter.peek() {
                    let n = n.clone();
                    if n == '&' {
                        let n = self.advance_char().unwrap();
                        self.emit_token_from_lexeme(format!("{}{}", c, n))
                    } else {
                        self.emit_token(TokenType::from(c), Some(c.to_string()))
                    }
                } else {
                    self.emit_token(TokenType::from(c), Some(c.to_string()))
                }
            }
            '|' => {
                if let Some(n) = self.source_iter.peek() {
                    let n = n.clone();
                    if n == '|' {
                        let n = self.advance_char().unwrap();
                        self.emit_token_from_lexeme(format!("{}{}", c, n))
                    } else {
                        self.emit_token(TokenType::from(c), Some(c.to_string()))
                    }
                } else {
                    self.emit_token(TokenType::from(c), Some(c.to_string()))
                }
            }
            '!' => {
                if let Some(n) = self.source_iter.peek() {
                    let n = n.clone();
                    if n == '=' {
                        let n = self.advance_char().unwrap();
                        self.emit_token_from_lexeme(format!("{}{}", c, n))
                    } else {
                        self.emit_token(TokenType::from(c), Some(c.to_string()))
                    }
                } else {
                    self.emit_token(TokenType::from(c), Some(c.to_string()))
                }
            }
            '=' => {
                if let Some(n) = self.source_iter.peek() {
                    let n = n.clone();
                    if n == '=' {
                        let n = self.advance_char().unwrap();
                        self.emit_token_from_lexeme(format!("{}{}", c, n))
                    } else {
                        self.emit_token(TokenType::from(c), Some(c.to_string()))
                    }
                } else {
                    self.emit_token(TokenType::from(c), Some(c.to_string()))
                }
            }
            '>' => {
                if let Some(n) = self.source_iter.peek() {
                    let n = n.clone();
                    if n == '=' {
                        let n = self.advance_char().unwrap();
                        self.emit_token_from_lexeme(format!("{}{}", c, n))
                    } else {
                        self.emit_token(TokenType::from(c), Some(c.to_string()))
                    }
                } else {
                    self.emit_token(TokenType::from(c), Some(c.to_string()))
                }
            }
            '<' => {
                if let Some(n) = self.source_iter.peek() {
                    let n = n.clone();
                    if n == '=' {
                        let n = self.advance_char().unwrap();
                        self.emit_token_from_lexeme(format!("{}{}", c, n))
                    } else {
                        self.emit_token(TokenType::from(c), Some(c.to_string()))
                    }
                } else {
                    self.emit_token(TokenType::from(c), Some(c.to_string()))
                }
            }
            '~' => self.emit_token(TokenType::from(c), Some(c.to_string())),

            _ => unreachable!(),
        })
    }

    #[inline]
    pub(self) fn lex_math(&mut self) -> Option<Token> {
        let c = self.advance_char().unwrap();

        Some(match c {
            '+' => {
                if let Some(n) = self.source_iter.peek() {
                    let n = n.clone();
                    if n == '+' {
                        let n = self.advance_char().unwrap();
                        self.emit_token_from_lexeme(format!("{}{}", c, n))
                    } else {
                        self.emit_token(TokenType::from(c), Some(c.to_string()))
                    }
                } else {
                    self.emit_token(TokenType::from(c), Some(c.to_string()))
                }
            }
            '-' => {
                if let Some(n) = self.source_iter.peek() {
                    let n = n.clone();
                    if n == '-' {
                        let n = self.advance_char().unwrap();
                        self.emit_token_from_lexeme(format!("{}{}", c, n))
                    } else {
                        self.emit_token(TokenType::from(c), Some(c.to_string()))
                    }
                } else {
                    self.emit_token(TokenType::from(c), Some(c.to_string()))
                }
            }
            '*' => {
                if let Some(n) = self.source_iter.peek() {
                    let n = n.clone();
                    if n == '*' {
                        let n = self.advance_char().unwrap();
                        self.emit_token_from_lexeme(format!("{}{}", c, n))
                    } else {
                        self.emit_token(TokenType::from(c), Some(c.to_string()))
                    }
                } else {
                    self.emit_token(TokenType::from(c), Some(c.to_string()))
                }
            }
            '/' => {
                if let Some(n) = self.source_iter.peek() {
                    let n = n.clone();
                    if n == '/' {
                        let n = self.advance_char().unwrap();
                        self.emit_token_from_lexeme(format!("{}{}", c, n))
                    } else {
                        self.emit_token(TokenType::from(c), Some(c.to_string()))
                    }
                } else {
                    self.emit_token(TokenType::from(c), Some(c.to_string()))
                }
            }

            _ => unreachable!(),
        })
    }

    pub(self) fn token_eof(&self) -> Token {
        Token::new(TokenType::LxEOF, None, self.line, self.column)
    }

    pub(self) fn emit_token(&self, token_type: TokenType, lexeme: Option<String>) -> Token {
        Token {
            token_type: token_type,
            lexeme,
            line: self.line,
            column: self.column,
        }
    }

    pub(self) fn emit_token_from_lexeme(&self, lexeme: String) -> Token {
        Token::new_from_lexeme(lexeme, self.line, self.column)
    }
}

pub trait Tokenizer<'a> {
    fn tokenizer_iter(self) -> TokenizerIterator<'a>;
}

impl<'a> Tokenizer<'a> for &'a str {
    fn tokenizer_iter(self) -> TokenizerIterator<'a> {
        TokenizerIterator {
            source_iter: (Box::new(self.chars().into_iter()) as Box<dyn Iterator<Item = char>>)
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
        if let Some(c) = self.source_iter.peek() {
            let c = c.clone();

            match c {
                ' ' | '\t' => self.lex_spaces(),
                '\n' => self.lex_newline(),
                '(' | ')' | '[' | ']' | '{' | '}' => self.lex_pairs(),
                ';' | ':' | ',' | '.' => self.lex_punct(),
                '0'..='9' => self.lex_number(),
                'A'..='Z' | 'a'..='z' => self.lex_alphanum(),
                '"' => self.lex_string(),
                '&' | '|' | '!' | '~' | '=' | '<' | '>' => self.lex_logic(),
                '+' | '-' | '*' | '/' | '%' => self.lex_math(),

                _ => unimplemented!("No token rules for tokens starting with {}", c),
            }
        } else {
            None
        }
    }
}
