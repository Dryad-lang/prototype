pub mod tokens;
pub mod ast;

use std::iter::Peekable;

use self::{tokens::{Token, TokenType}, ast::{ProgramStmt, Stmt, BlockStmt, DefStmt, FuncDefStmt, Expr, IntoBoxed, NumLit, IdLit}};

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
    pub fn ast(&mut self) -> ProgramStmt {
        let mut stmts: Vec<Stmt> = Vec::new();

        while let Some(_) = self.tokens.by_ref().peek() {
            let stmt = self.statement();

            stmts.push(stmt);
        }

        ProgramStmt {
            body: stmts,
        }
    }

    #[inline]
    pub fn statement(&mut self) -> Stmt {
        let token = self.tokens.by_ref().next();

        let token = match token {
            Some(tk) => tk,
            None => return Stmt::Expr(Expr::Debug(ast::DebugExpr { value: "EOF".into() })),
        };

        match token.token_type {
            TokenType::LxLCurly => self.block_stmt(),
            TokenType::LxFunc => self.func_stmt(),
            TokenType::LxSemiColon => { self.tokens.by_ref().next().unwrap(); self.statement() }

            _ => self.expr_stmt(),
        }
    }

    #[inline]
    pub fn block_stmt(&mut self) -> Stmt {
        self.tokens.by_ref().next().unwrap();

        let mut stmts = Vec::new();

        while let Some(token) = self.tokens.by_ref().peek() {
            match token.token_type {
                TokenType::LxRCurly => break,

                _ => stmts.push(self.statement()),
            }
        }

        Stmt::Block(BlockStmt { stmts })
    }

    #[inline]
    pub fn func_stmt(&mut self) -> Stmt {

        let name_token = self.tokens.by_ref().next().unwrap();
        if name_token.token_type != TokenType::LxId {
            panic!("Id expected for function name declaration");
        }
        let name = name_token.lexeme.clone();

        let lparen_token = self.tokens.by_ref().next().unwrap();
        if lparen_token.token_type != TokenType::LxLParen {
            panic!("Left parenthesis expected");
        }

        let mut params: Vec<String> = Vec::new();

        while let Some(fn_arg_token) = self.tokens.by_ref().peek() {
            if fn_arg_token.token_type != TokenType::LxId {
                panic!("Id expected for function parameter");
            }
            let fn_arg = self.tokens.by_ref().next().unwrap().lexeme;

            params.push(fn_arg);

            let next = self.tokens.by_ref().next().unwrap().token_type;

            if next != TokenType::LxComma && next != TokenType::LxRParen {
                panic!("Comma or closing parenthesis expected");
            }

            if next == TokenType::LxRParen {
                break;
            }
        }

        let block = self.block_stmt().boxed();

        let func_def = Stmt::Def(DefStmt::FuncDef(FuncDefStmt {
            name,
            params,
            block,
        }));

        func_def
    }

    #[inline]
    pub fn expr_stmt(&mut self) -> Stmt {
        let mut debug_str = String::new();

        while let Some(token) = self.tokens.by_ref().peek() {
            if token.token_type == TokenType::LxSemiColon {
                break;
            }

            debug_str.push_str(&self.tokens.next().unwrap().lexeme.as_str());
        }

        Stmt::Expr(Expr::Debug(ast::DebugExpr { value: debug_str }))
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parser_basics() {
        let source = "func test(a, b, c) {x++; --z;}";

        let mut parser = source.parser_iter();

        let tokens = parser.ast();

        println!("{:#?}", tokens);
    }
}