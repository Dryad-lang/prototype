pub mod tokens;
pub mod ast;

use std::{iter::Peekable, result::Result, error::Error};

use self::{tokens::{Token, TokenType}, ast::{ProgramStmt, Stmt, BlockStmt, DefStmt, FuncDefStmt, Expr, IntoBoxed, IdLit}};

use super::tokenizer::{Tokenizer, TokenizerIterator};

pub struct ParserIterator<'a> {
    tokens: Peekable<Box<dyn Iterator<Item = Token> + 'a>>,
}

impl<'a> ParserIterator<'a> {
    pub fn new(tokenizer: TokenizerIterator<'a>) -> Self {
        Self {
            tokens: (Box::new(
                tokenizer
                    .collect::<Vec<Token>>()
                    .into_iter()
                ) as Box<dyn Iterator<Item = Token>>)
                .peekable(),
        }
    }

    #[inline]
    pub(self) fn advance_token(&mut self) -> Option<Token> {
        self.tokens.by_ref()
                   .next()
    }

    #[inline]
    pub(self) fn peek_token(&mut self) -> Option<&Token> {
        self.tokens.by_ref()
                   .peek()
    }

    #[inline]
    pub fn ast(&mut self) -> Result<ProgramStmt, Box<dyn Error>> {
        let mut stmts: Vec<Stmt> = Vec::new();

        while let Some(_) = self.tokens.by_ref().peek() {
            let stmt = self.statement()?;

            stmts.push(stmt.clone());

            if stmt == Stmt::EOF {
                break;
            }
        }

        Ok(ProgramStmt { body: stmts })
    }

    #[inline]
    pub fn statement(&mut self) -> Result<Stmt, Box<dyn Error>> {
        let token = if let Some(_) = self.peek_token() {
            self.advance_token()
                .unwrap()
        } else {
            return Ok(Stmt::EOF);
        };

        match token.token_type {
            TokenType::LxVar => self.var_declaration(),

            _ => self.expression_statement(),
        }        
    }

    #[inline]
    pub fn expression_statement(&mut self) -> Result<Stmt, Box<dyn Error>> {
        let expr = self.expression()?;

        if self.advance_token().unwrap().token_type != TokenType::LxSemiColon {
            panic!("Expected semi colon after expression");
        }

        Ok(Stmt::Expr(expr))
    }

    #[inline]
    pub fn var_declaration(&mut self) -> Result<Stmt, Box<dyn Error>> {
        let token = if let Some(_) = self.peek_token() {
            self.advance_token()
                .unwrap()
        } else {
            return Ok(Stmt::EOF);
        };

        if token.token_type != TokenType::LxId {
            panic!("Expected id for var declaration");
        };

        let init: Option<Box<Expr>> = if let Some(token) = self.peek_token() {
            if token.token_type == TokenType::LxAssign {
                self.advance_token()
                    .unwrap();
                Some(self.expression()?.boxed())
            } else {
                None
            }
        } else {
            return Ok(Stmt::EOF);
        };

        if self.advance_token().unwrap().token_type != TokenType::LxSemiColon {
            panic!("Expected ';' for variable declaration");
        }

        Ok(Stmt::Bind(ast::BindStmt { name: token.lexeme.clone(), init }))
    }

    #[inline]
    pub fn expression(&mut self) -> Result<Expr, Box<dyn Error>> {
        self.equality()
    }

    #[inline]
    pub fn equality(&mut self) -> Result<Expr, Box<dyn Error>> {
        let mut expr = self.comparison()?;

        while let Some(token) = self.peek_token() {
            if token.token_type == TokenType::LxEq || token.token_type == TokenType::LxNeq {
                let op = self.advance_token()
                                    .unwrap()
                                    .clone();

                expr = Expr::Bin(ast::BinExpr {
                    left: expr.boxed(),
                    op: match op.token_type {
                        TokenType::LxEq  => ast::BinOp::Eq,
                        TokenType::LxNeq => ast::BinOp::Neq,

                        o => unimplemented!("Binary operator {:?} not implemented yet", o),
                    },
                    right: self.comparison()?.boxed(),
                })
            } else {
                break;
            }
        }

        Ok(expr)
    }

    #[inline]
    pub fn comparison(&mut self) -> Result<Expr, Box<dyn Error>> {
        let mut expr = self.term()?;

        while let Some(token) = self.peek_token() {
            if token.token_type == TokenType::LxGe || token.token_type == TokenType::LxGt || token.token_type == TokenType::LxLe || token.token_type == TokenType::LxLt {
                let op = self.advance_token()
                                    .unwrap()
                                    .clone();

                expr = Expr::Bin(ast::BinExpr {
                    left: expr.boxed(),
                    op: match op.token_type {
                        TokenType::LxGe => ast::BinOp::Ge,
                        TokenType::LxGt => ast::BinOp::Gt,
                        TokenType::LxLe => ast::BinOp::Le,
                        TokenType::LxLt => ast::BinOp::Lt,

                        o => unimplemented!("Binary operator {:?} not implemented yet", o),
                    },
                    right: self.term()?.boxed(),
                })
            } else {
                break;
            }
        }

        Ok(expr)
    }

    #[inline]
    pub fn term(&mut self) -> Result<Expr, Box<dyn Error>> {
        let mut expr = self.factor()?;

        while let Some(token) = self.peek_token() {
            if token.token_type == TokenType::LxMinus || token.token_type == TokenType::LxPlus {
                let op = self.advance_token()
                                    .unwrap()
                                    .clone();

                expr = Expr::Bin(ast::BinExpr {
                    left: expr.boxed(),
                    op: match op.token_type {
                        TokenType::LxMinus => ast::BinOp::Sum,
                        TokenType::LxPlus  => ast::BinOp::Sub,

                        o => unimplemented!("Binary operator {:?} not implemented yet", o),
                    },
                    right: self.factor()?.boxed(),
                })
            } else {
                break;
            }
        }

        Ok(expr)
    }

    #[inline]
    pub fn factor(&mut self) -> Result<Expr, Box<dyn Error>> {
        let mut expr = self.unary()?;

        while let Some(token) = self.peek_token() {
            if token.token_type == TokenType::LxDiv || token.token_type == TokenType::LxMult {
                let op = self.advance_token()
                                    .unwrap()
                                    .clone();

                expr = Expr::Bin(ast::BinExpr {
                    left: expr.boxed(),
                    op: match op.token_type {
                        TokenType::LxDiv  => ast::BinOp::Div,
                        TokenType::LxMult => ast::BinOp::Mult,

                        o => unimplemented!("Binary operator {:?} not implemented yet", o),
                    },
                    right: self.unary()?.boxed(),
                })
            } else {
                break;
            }
        }

        Ok(expr)
    }

    #[inline]
    pub fn unary(&mut self) -> Result<Expr, Box<dyn Error>> {
        if let Some(token) = self.peek_token() {
            if token.token_type == TokenType::LxNot || token.token_type == TokenType::LxMinus {
                let op = self.advance_token()
                                    .unwrap()
                                    .clone();

                return Ok(Expr::Unary(ast::UnaryExpr {
                    op: match op.token_type {
                        TokenType::LxNot   => ast::UnOp::Not,
                        TokenType::LxMinus => ast::UnOp::Negative,

                        o => unimplemented!("Binary operator {:?} not implemented yet", o),
                    },
                    expr: self.unary()?.boxed(),
                }));
            }
        }

        self.primary()
    }

    #[inline]
    pub fn primary(&mut self) -> Result<Expr, Box<dyn Error>> {
        Ok(if let Some(_) = self.peek_token() {
            let token = self.advance_token().unwrap();
            match token.token_type.clone() {
                TokenType::LxBool => Expr::Literal(ast::LiteralExpr::BoolLit(ast::BoolLit { value: match token.lexeme.as_str() { "true" => true, "false" => false, _ => unreachable!(), } })),
                TokenType::LxNumber => Expr::Literal(ast::LiteralExpr::NumLit(ast::NumLit { value: token.lexeme.parse::<f64>()? })),
                TokenType::LxString => Expr::Literal(ast::LiteralExpr::StrLit(ast::StrLit { value: token.lexeme.clone() })),
                TokenType::LxId => Expr::Literal(ast::LiteralExpr::IdLit(IdLit { value: token.lexeme })),
                TokenType::LxLParen => {
                    let expr = self.expression()?;

                    if let Some(tk) = self.peek_token() {
                        if tk.token_type != TokenType::LxRParen {
                            panic!("Expected ')'");
                        } else {
                            self.advance_token()
                                .unwrap();

                            Expr::Group(expr.boxed())
                        }
                    } else {
                        Expr::Debug(ast::DebugExpr { value: "EOF".into() })
                    }
                },

                o => unimplemented!("Binary operator {:?} not implemented yet", o)
            }
        } else {
            unreachable!();
        })
    }
}

impl<'a> Iterator for ParserIterator<'a> {
    type Item=Stmt;

    #[inline]
    fn next(&mut self) -> Option<Self::Item> {

        None
    }
}

pub trait GetParser<'a> {
    fn parser_iter(&'a self) -> ParserIterator<'a>;
}

impl<'a> GetParser<'a> for &'a str {
    #[inline]
    fn parser_iter(&'a self) -> ParserIterator<'a> {
        ParserIterator::new(self.tokenizer_iter())
    }
}

impl<'a> GetParser<'a> for String {
    #[inline]
    fn parser_iter(&'a self) -> ParserIterator<'a> {
        ParserIterator::new(self.tokenizer_iter())
    }
}