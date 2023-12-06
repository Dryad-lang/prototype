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
    pub(self) fn consume_token(&mut self, token_type: TokenType, message: String) -> Result<Token, Box<dyn Error>> {
        if let Some(token) = self.peek_token() { if token.token_type == token_type { let tk = token.clone(); self.advance_token(); Ok(tk) } else { Err(message.into()) } } else { Err(message.into()) }
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
            let token = self.advance_token().unwrap();
            let stmt = self.declaration(token)?;

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
            //TokenType::LxVar => self.var_declaration(),
            //TokenType::LxFunc => self.func_declaration(),
            //TokenType::LxLCurly => self.block_declaration(),
            TokenType::LxVar | TokenType::LxFunc | TokenType::LxLCurly => self.declaration(token.clone()),

            _ => self.expression_statement(),
        }        
    }

    #[inline]
    pub fn expression_statement(&mut self) -> Result<Stmt, Box<dyn Error>> {
        let expr = self.expression()?;

        self.consume_token(TokenType::LxSemiColon, "Expected ';' after expression".into())?;

        Ok(Stmt::Expr(expr))
    }

    #[inline]
    pub fn declaration(&mut self, token: Token) -> Result<Stmt, Box<dyn Error>> {
        match token.token_type {
            TokenType::LxVar => self.var_declaration(),
            TokenType::LxFunc => self.func_declaration(),
            TokenType::LxLCurly => self.block_declaration(),

            _ => self.statement(),
        }        
    }

    #[inline]
    pub fn var_declaration(&mut self) -> Result<Stmt, Box<dyn Error>> {
        let token = self.consume_token(TokenType::LxId, "Expected id for var declaration".into())?;

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

        self.consume_token(TokenType::LxSemiColon, "Expected ';' after variable declaration".into())?;

        Ok(Stmt::Bind(ast::BindStmt { name: token.lexeme.clone(), init }))
    }

    #[inline]
    pub fn func_declaration(&mut self) -> Result<Stmt, Box<dyn Error>> {
        let func_name_tk = self.consume_token(TokenType::LxId, "Expected id for function name".into())?;
        self.consume_token(TokenType::LxLParen, "Expected '(' after function name".into())?;
        let mut params: Vec<String> = Vec::new();
        
        if let Some(token) = self.peek_token() {
            let token = token.clone();
            if token.token_type != TokenType::LxRCurly {
                while let Some(token) = self.peek_token() {
                    let token = token.clone();
                    if token.token_type != TokenType::LxComma {
                        if token.token_type == TokenType::LxId {
                            params.push(self.consume_token(TokenType::LxId, "Expected id for function argument".into())?.lexeme);
                        } else {
                            break;
                        }
                    } else {
                        self.consume_token(TokenType::LxComma, "Expected a comma between function arguments".into())?;
                    }
                }
            }
        }
        
        self.consume_token(TokenType::LxRParen, "Expect ')' after parameters".into())?;
        self.consume_token(TokenType::LxLCurly, "Expect '{' before function body".into())?;
        let body = self.block_declaration()?;

        Ok(Stmt::Def(DefStmt::FuncDef(FuncDefStmt { name: func_name_tk.lexeme.clone(), params, block: body.boxed() })))
    }

    #[inline]
    pub fn block_declaration(&mut self) -> Result<Stmt, Box<dyn Error>> {
        let mut stmts: Vec<Stmt> = Vec::new();

        while let Some(token) = self.peek_token() {
            let token = token.clone();
            if token.token_type == TokenType::LxRCurly {
                break;
            }

            let d = self.advance_token().unwrap().clone();
            stmts.push(self.declaration(d)?);
        }

        self.consume_token(TokenType::LxRCurly, "Expect '}' after block".into())?;

        Ok(Stmt::Block(BlockStmt { stmts }))
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
            if token.token_type == TokenType::LxMinus || token.token_type == TokenType::LxPlus || token.token_type == TokenType::LxMult || token.token_type == TokenType::LxDiv {
                let op = self.advance_token()
                                    .unwrap()
                                    .clone();

                expr = Expr::Bin(ast::BinExpr {
                    left: expr.boxed(),
                    op: match op.token_type {
                        TokenType::LxMinus => ast::BinOp::Sub,
                        TokenType::LxPlus  => ast::BinOp::Sum,
                        TokenType::LxMult  => ast::BinOp::Mult,
                        TokenType::LxDiv   => ast::BinOp::Div,

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

                    if let Some(_) = self.peek_token() {
                        self.consume_token(TokenType::LxRParen, "Expected ')'".into())?;

                        Expr::Group(expr.boxed())
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