pub mod tokens;
pub mod ast;

use std::{iter::Peekable, result::Result, error::Error};

use self::{tokens::{Token, TokenType}, ast::{ProgramStmt, Stmt, BlockStmt, DefStmt, FuncDefStmt, Expr, IdLit, IfStmt, BinOp, UnOp, IntoRc}};

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
            TokenType::LxVar    | TokenType::LxFunc | 
            TokenType::LxLCurly | TokenType::LxIf   |
            TokenType::LxWhile  | TokenType::LxConst => self.declaration(token.clone()),

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
            TokenType::LxVar    => self.var_declaration(),
            TokenType::LxFunc   => self.func_declaration(),
            TokenType::LxLCurly => self.block_declaration(),
            TokenType::LxIf     => self.if_declaration(),
            TokenType::LxWhile  => self.while_declaration(),
            TokenType::LxConst  => self.const_declaration(),

            _ => self.statement(),
        }        
    }

    #[inline]
    pub fn var_declaration(&mut self) -> Result<Stmt, Box<dyn Error>> {
        let token = self.consume_token(TokenType::LxId, "Expected id for var declaration".into())?;

        let init: Option<Expr> = if let Some(token) = self.peek_token() {
            if token.token_type == TokenType::LxAssign {
                self.advance_token()
                    .unwrap();
                Some(self.expression()?)
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
    pub fn const_declaration(&mut self) -> Result<Stmt, Box<dyn Error>> {
        let token = self.consume_token(TokenType::LxId, "Expected id for const declaration".into())?;

        let init: Expr = if let Some(_) = self.peek_token() {
            self.consume_token(TokenType::LxAssign, "Expected '=' after const id".into())?;

            self.expression()?
        } else {
            return Ok(Stmt::EOF);
        };

        self.consume_token(TokenType::LxSemiColon, "Expected ';' after const declaration".into())?;

        Ok(Stmt::Def(ast::DefStmt::ConstDef(ast::ConstDefStmt { name: token.lexeme.clone(), init })))
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

        Ok(Stmt::Def(DefStmt::FuncDef(FuncDefStmt { name: func_name_tk.lexeme.clone(), params, block: BlockStmt::from(body) })))
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

        Ok(Stmt::Block(BlockStmt(stmts)))
    }

    #[inline]
    pub fn if_declaration(&mut self) -> Result<Stmt, Box<dyn Error>> {
        self.consume_token(TokenType::LxLParen, "Expected '(' after if keyword".into())?;
        let expr = self.expression()?;
        self.consume_token(TokenType::LxRParen, "Expected closing ')' for if keyword".into())?;
        self.consume_token(TokenType::LxLCurly, "Expected '{' for if keyword block".into())?;
        let then_body = self.block_declaration()?;

        let mut if_stmt = IfStmt {
            condition: expr,
            then_block: BlockStmt::from(then_body),
            else_block: None,
        };

        if let Some(token) = self.peek_token() {
            let token = token.clone();
            if token.token_type == TokenType::LxElse {
                self.advance_token();
                self.consume_token(TokenType::LxLCurly, "Expected '{' for else keyword block".into())?;
                let else_body = self.block_declaration()?;
                if_stmt.else_block = Some(BlockStmt::from(else_body));
            }
        }

        Ok(Stmt::If(if_stmt))
    }
    
    #[inline]
    pub fn while_declaration(&mut self) -> Result<Stmt, Box<dyn Error>> {
        self.consume_token(TokenType::LxLParen, "Expected '(' after for keyword".into())?;
        let expr = self.expression()?;
        self.consume_token(TokenType::LxRParen, "Expected closing ')' for while keyword".into())?;
        self.consume_token(TokenType::LxLCurly, "Expected '{' for while keyword block".into())?;
        let while_body = self.block_declaration()?;

        Ok(Stmt::While(ast::WhileStmt { condition: expr, body: BlockStmt::from(while_body) }))
    }

    #[inline]
    pub fn expression(&mut self) -> Result<Expr, Box<dyn Error>> {
        self.equality()
    }

    #[inline]
    pub fn equality(&mut self) -> Result<Expr, Box<dyn Error>> {
        let mut expr = self.logic()?;

        while let Some(token) = self.peek_token() {
            if token.token_type == TokenType::LxEq || token.token_type == TokenType::LxNeq {
                let op = self.advance_token()
                                    .unwrap()
                                    .clone();

                expr = Expr::Bin(ast::BinExpr {
                    left: expr.rc(),
                    op: BinOp::from(op.token_type),
                    right: self.logic()?.rc(),
                })
            } else {
                break;
            }
        }

        Ok(expr)
    }

    #[inline]
    pub fn logic(&mut self) -> Result<Expr, Box<dyn Error>> {
        let mut expr = self.comparison()?;

        while let Some(token) = self.peek_token() {
            if token.token_type == TokenType::LxLAnd || token.token_type == TokenType::LxLOr {
                let op = self.advance_token()
                                    .unwrap()
                                    .clone();

                expr = Expr::Bin(ast::BinExpr {
                    left: expr.rc(),
                    op: BinOp::from(op.token_type),
                    right: self.comparison()?.rc(),
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
                    left: expr.rc(),
                    op: BinOp::from(op.token_type),
                    right: self.term()?.rc(),
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
                    left: expr.rc(),
                    op: BinOp::from(op.token_type),
                    right: self.factor()?.rc(),
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
                    left: expr.rc(),
                    op: BinOp::from(op.token_type),
                    right: self.unary()?.rc(),
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
                    op: UnOp::from(op.token_type),
                    expr: self.unary()?.rc(),
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
                TokenType::LxBool => Expr::Literal(ast::LiteralExpr::BoolLit(ast::BoolLit(match token.lexeme.as_str() { "true" => true, "false" => false, _ => unreachable!() }))),
                TokenType::LxNumber => Expr::Literal(ast::LiteralExpr::NumLit(ast::NumLit(token.lexeme.parse::<f64>()?))),
                TokenType::LxString => Expr::Literal(ast::LiteralExpr::StrLit(ast::StrLit(token.lexeme.clone()))),
                TokenType::LxId => Expr::Literal(ast::LiteralExpr::IdLit(IdLit(token.lexeme))),
                TokenType::LxLParen => {
                    let expr = self.expression()?;

                    self.consume_token(TokenType::LxRParen, "Expected ')'".into())?;

                    Expr::Group(expr.rc())
                },

                o => unimplemented!("Binary operator {:?} not implemented yet", o)
            }
        } else {
            unreachable!();
        })
    }
}

// TODO: wtf was I going to do with it?
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