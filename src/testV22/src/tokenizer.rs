use std::iter::{Iterator, Peekable};

use super::parser::tokens::{Token, TokenType, Location};

pub struct TokenizerIterator<'a> {
    // source: String,
    source_iter: Peekable<Box<dyn Iterator<Item = char> + 'a>>,
    line: usize,
    column: usize,
    tmp_lexeme: String,
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

        Some(self.emit_token_from_char(c))
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
        'outer: while let Some(c) = self.source_iter.by_ref().peek() {
            if (*c).is_digit(10) {
                let c = self.advance_char().unwrap();
                self.tmp_lexeme.push(c);
            } else if *c == '.' {
                let c = self.advance_char().unwrap();
                self.tmp_lexeme.push(c);
                while let Some(c) = self.source_iter.by_ref().peek() {
                    if (*c).is_digit(10) {
                        let c = self.advance_char().unwrap();
                        self.tmp_lexeme.push(c);
                    } else {
                        break 'outer;
                    }
                }
            } else {
                break;
            }
        }

        Some(self.emit_token(TokenType::LxNumber))
    }

    #[inline]
    pub(self) fn lex_alphanum(&mut self) -> Option<Token> {
        while let Some(c) = self.source_iter.by_ref().peek() {
            if (*c).is_alphabetic() {
                let c = self.advance_char().unwrap();
                self.tmp_lexeme.push(c);
            } else {
                break;
            }
        }

        Some(self.emit_token_from_lexeme())
    }

    #[inline]
    pub(self) fn lex_string(&mut self) -> Option<Token> {
        self.advance_char();

        while let Some(c) = self.source_iter.by_ref().peek() {
            if *c != '"' {
                let c = self.advance_char().unwrap();
                self.tmp_lexeme.push(c);
            } else {
                break;
            }
        }

        self.advance_char();

        Some(self.emit_token(TokenType::LxString))
    }

    #[inline]
    pub(self) fn lex_punct(&mut self) -> Option<Token> {
        let c = self.advance_char().unwrap();

        Some(self.emit_token_from_char(c))
    }

    #[inline]
    pub(self) fn lex_logic(&mut self) -> Option<Token> {
        let c = self.advance_char().unwrap();
        self.tmp_lexeme.push(c);

        Some(match c {
            '&' => {
                if let Some(n) = self.source_iter.peek() {
                    if *n == '&' {
                        let n = self.advance_char().unwrap();
                        self.tmp_lexeme.push(n);
                        self.emit_token_from_lexeme()
                    } else {
                        self.emit_token_from_char(c)
                    }
                } else {
                    self.emit_token_from_char(c)
                }
            }
            '|' => {
                if let Some(n) = self.source_iter.peek() {
                    if *n == '|' {
                        let n = self.advance_char().unwrap();
                        self.tmp_lexeme.push(n);
                        self.emit_token_from_lexeme()
                    } else {
                        self.emit_token_from_char(c)
                    }
                } else {
                    self.emit_token_from_char(c)
                }
            }
            '!' => {
                if let Some(n) = self.source_iter.peek() {
                    if *n == '=' {
                        let n = self.advance_char().unwrap();
                        self.tmp_lexeme.push(n);
                        self.emit_token_from_lexeme()
                    } else {
                        self.emit_token_from_char(c)
                    }
                } else {
                    self.emit_token_from_char(c)
                }
            }
            '=' => {
                if let Some(n) = self.source_iter.peek() {
                    if *n == '=' {
                        let n = self.advance_char().unwrap();
                        self.tmp_lexeme.push(n);
                        self.emit_token_from_lexeme()
                    } else {
                        self.emit_token_from_char(c)
                    }
                } else {
                    self.emit_token_from_char(c)
                }
            }
            '>' => {
                if let Some(n) = self.source_iter.peek() {
                    if *n == '=' {
                        let n = self.advance_char().unwrap();
                        self.tmp_lexeme.push(n);
                        self.emit_token_from_lexeme()
                    } else {
                        self.emit_token_from_char(c)
                    }
                } else {
                    self.emit_token_from_char(c)
                }
            }
            '<' => {
                if let Some(n) = self.source_iter.peek() {
                    if *n == '=' {
                        let n = self.advance_char().unwrap();
                        self.tmp_lexeme.push(n);
                        self.emit_token_from_lexeme()
                    } else {
                        self.emit_token_from_char(c)
                    }
                } else {
                    self.emit_token_from_char(c)
                }
            }
            '~' => self.emit_token_from_char(c),

            _ => unreachable!(),
        })
    }

    #[inline]
    pub(self) fn lex_math(&mut self) -> Option<Token> {
        let c = self.advance_char().unwrap();

        Some(match c {
            '+' => {
                if let Some(n) = self.source_iter.peek() {
                    if *n == '+' {
                        let n = self.advance_char().unwrap();
                        self.tmp_lexeme.push(n);
                        self.emit_token_from_lexeme()
                    } else {
                        self.emit_token_from_char(c)
                    }
                } else {
                    self.emit_token_from_char(c)
                }
            }
            '-' => {
                if let Some(n) = self.source_iter.peek() {
                    if *n == '-' {
                        let n = self.advance_char().unwrap();
                        self.tmp_lexeme.push(n);
                        self.emit_token_from_lexeme()
                    } else {
                        self.emit_token_from_char(c)
                    }
                } else {
                    self.emit_token_from_char(c)
                }
            }
            '*' => {
                if let Some(n) = self.source_iter.peek() {
                    if *n == '*' {
                        let n = self.advance_char().unwrap();
                        self.tmp_lexeme.push(n);
                        self.emit_token_from_lexeme()
                    } else {
                        self.emit_token_from_char(c)
                    }
                } else {
                    self.emit_token_from_char(c)
                }
            }
            '/' => {
                if let Some(n) = self.source_iter.peek() {
                    if *n == '/' {
                        let n = self.advance_char().unwrap();
                        self.tmp_lexeme.push(n);
                        self.emit_token_from_lexeme()
                    } else {
                        self.emit_token_from_char(c)
                    }
                } else {
                    self.emit_token_from_char(c)
                }
            }

            _ => unreachable!(),
        })
    }

    /*
     * pub(self) fn token_eof(&self) -> Token {
     *   Token::new(TokenType::LxEOF, None, self.line, self.column)
     * }
     */

    pub(self) fn emit_token(&mut self, token_type: TokenType) -> Token {
        let lexime = self.tmp_lexeme.clone();
        self.tmp_lexeme.clear();

        Token {
            token_type: token_type,
            lexeme: Some(lexime),
            location: Location { line: self.line, column: self.column }
        }
    }

    pub(self) fn emit_token_from_lexeme(&mut self) -> Token {
        let lexeme = self.tmp_lexeme.clone();
        self.tmp_lexeme.clear();

        Token { token_type: TokenType::from(lexeme.as_str()), lexeme: Some(lexeme), location: Location { line: self.line, column: self.column } }
    }

    pub(self) fn emit_token_from_char(&mut self, c: char) -> Token {
        self.tmp_lexeme.clear();

        Token { token_type: TokenType::from(c), lexeme: Some(c.to_string()), location: Location { line: self.line, column: self.column } }
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
            tmp_lexeme: String::with_capacity(32),
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
