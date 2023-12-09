use std::rc::Rc;

use super::tokens::TokenType;

pub trait IntoBoxed {
    fn boxed(self) -> Box<Self>;
}

pub trait IntoRc {
    fn rc(self) -> Rc<Self>;
}

#[derive(Debug, PartialEq, Clone)]
pub enum BinOp {
    Sum,
    Sub,
    Mult,
    Div,

    Eq,
    Neq,
    Ge,
    Gt,
    Le,
    Lt,

    And,
    Or,
}

impl From<TokenType> for BinOp {
    #[inline]
    fn from(value: TokenType) -> Self {
        match value {
            TokenType::LxPlus => Self::Sum,
            TokenType::LxMinus => Self::Sub,
            TokenType::LxMult => Self::Mult,
            TokenType::LxDiv => Self::Div,

            TokenType::LxEq => Self::Eq,
            TokenType::LxNeq => Self::Neq,
            TokenType::LxGe => Self::Ge,
            TokenType::LxGt => Self::Gt,
            TokenType::LxLe => Self::Le,
            TokenType::LxLt => Self::Lt,

            TokenType::LxLAnd => Self::And,
            TokenType::LxLOr => Self::Or,

            _ => unimplemented!(),
        }
    }
}

#[derive(Debug, PartialEq, Clone)]
pub enum UnOp {
    Inc,
    Dec,

    Not,
    Negative,
}

impl From<TokenType> for UnOp {
    #[inline]
    fn from(value: TokenType) -> Self {
        match value {
            TokenType::LxInc => Self::Inc,
            TokenType::LxDec => Self::Dec,

            TokenType::LxNot => Self::Not,
            TokenType::LxMinus => Self::Negative,

            _ => unimplemented!(),
        }
    }
}

#[derive(Debug, PartialEq, Clone)]
pub struct BinExpr {
    pub left: Rc<Expr>,
    pub op: BinOp,
    pub right: Rc<Expr>,
    pub location: Location,
}

#[derive(Debug, PartialEq, Clone)]
pub struct CallExpr {
    pub fn_name: Rc<Expr>,
    pub args: Vec<Rc<Expr>>,
    pub location: Location,
}

#[derive(Debug, PartialEq, Clone)]
pub struct FuncArgs(pub Vec<Stmt>, pub Location);

#[derive(Debug, PartialEq, Clone)]
pub struct StrLit(pub String, pub Location);

#[derive(Debug, PartialEq, Clone)]
pub struct NumLit(pub f64, pub Location);

#[derive(Debug, PartialEq, Clone)]
pub struct IdLit(pub String, pub Location);

#[derive(Debug, PartialEq, Clone)]
pub struct BoolLit(pub bool, pub Location);

#[derive(Debug, PartialEq, Clone)]
pub enum LiteralExpr {
    StrLit(StrLit),
    NumLit(NumLit),
    IdLit(IdLit),
    BoolLit(BoolLit),
}

#[derive(Debug, PartialEq, Clone)]
pub struct UnaryExpr {
    pub op: UnOp,
    pub expr: Rc<Expr>,
    pub location: Location,
}

#[derive(Debug, PartialEq, Clone)]
pub struct DebugExpr(pub String, pub Location);

#[derive(Debug, PartialEq, Clone)]
pub enum Expr {
    Bin(BinExpr),
    Call(CallExpr),
    Literal(LiteralExpr),
    Unary(UnaryExpr),
    Debug(DebugExpr),
    Group(Rc<Expr>),
    Var(IdLit),
}

impl IntoBoxed for Expr {
    #[inline]
    fn boxed(self) -> Box<Self> {
        Box::new(self)
    }
}

impl IntoRc for Expr {
    #[inline]
    fn rc(self) -> Rc<Self> {
        Rc::new(self)
    }
}

#[derive(Debug, PartialEq, Clone)]
pub struct BindStmt {
    pub name: String,
    pub init: Expr,
    pub location: Location,
}

#[derive(Debug, PartialEq, Clone)]
pub struct ConstDefStmt {
    pub name: String,
    pub init: Expr,
    pub location: Location,
}

#[derive(Debug, PartialEq, Clone)]
pub struct BlockStmt(pub Vec<Stmt>, pub Location);

impl From<Stmt> for BlockStmt {
    #[inline]
    fn from(value: Stmt) -> Self {
        match value {
            Stmt::Block(block) => block,

            _ => unreachable!(),
        }
    }
}

#[derive(Debug, PartialEq, Clone)]
pub struct FuncDefStmt {
    pub name: String,
    pub params: Vec<String>,
    pub block: BlockStmt,
    pub location: Location,
}

#[derive(Debug, PartialEq, Clone)]
pub enum DefStmt {
    FuncDef(FuncDefStmt),
    ConstDef(ConstDefStmt),
}

#[derive(Debug, PartialEq, Clone)]
pub struct IfStmt {
    pub condition: Expr,
    pub then_block: BlockStmt,
    pub else_block: Option<BlockStmt>,
    pub location: Location,
}

#[derive(Debug, PartialEq, Clone)]
pub struct WhileStmt {
    pub condition: Expr,
    pub body: BlockStmt,
    pub location: Location,
}

#[derive(Debug, PartialEq, Clone)]
pub enum Stmt {
    Bind(BindStmt),
    Def(DefStmt),
    Block(BlockStmt),
    Expr(Expr),
    If(IfStmt),
    While(WhileStmt),

    EOF,
}

impl IntoBoxed for Stmt {
    #[inline]
    fn boxed(self) -> Box<Self> {
        Box::new(self)
    }
}

impl IntoRc for Stmt {
    #[inline]
    fn rc(self) -> Rc<Self> {
        Rc::new(self)
    }
}

#[derive(Debug)]
pub struct ProgramStmt {
    pub body: Vec<Stmt>,
}

impl ProgramStmt {
    #[inline]
    pub fn new() -> Self {
        Self { body: Vec::new() }
    }
}

#[derive(Debug, PartialEq, Clone)]
pub struct Location {
    pub line: usize,
    pub column: usize,
}
