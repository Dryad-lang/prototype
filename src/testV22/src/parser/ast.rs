
pub trait IntoBoxed {
    fn boxed(self) -> Box<Self>;
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
}

#[derive(Debug, PartialEq, Clone)]
pub enum UnOp {
    Inc,
    Dec,

    Not,
    Negative,
}

#[derive(Debug, PartialEq, Clone)]
pub struct BinExpr {
    pub left: Box<Expr>,
    pub op: BinOp,
    pub right: Box<Expr>
}

#[derive(Debug, PartialEq, Clone)]
pub struct CallExpr {
    pub fn_name: Box<Expr>,
    pub args: Vec<Box<Expr>>
}

#[derive(Debug, PartialEq, Clone)]
pub struct StrLit {
    pub value: String,
}

#[derive(Debug, PartialEq, Clone)]
pub struct NumLit {
    pub value: f64,
}

#[derive(Debug, PartialEq, Clone)]
pub struct IdLit {
    pub value: String,
}

#[derive(Debug, PartialEq, Clone)]
pub struct BoolLit {
    pub value: bool,
}

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
    pub expr: Box<Expr>,
}

#[derive(Debug, PartialEq, Clone)]
pub struct DebugExpr {
    pub value: String,
}

#[derive(Debug, PartialEq, Clone)]
pub enum Expr {
    Bin(BinExpr),
    Call(CallExpr),
    Literal(LiteralExpr),
    Unary(UnaryExpr),
    Debug(DebugExpr),
    Group(Box<Expr>),
    Var(IdLit),
}

impl IntoBoxed for Expr {
    fn boxed(self) -> Box<Self> {
        Box::new(self)
    }
}

#[derive(Debug, PartialEq, Clone)]
pub struct BindStmt {
    pub name: String,
    pub init: Option<Box<Expr>>,
}

#[derive(Debug, PartialEq, Clone)]
pub struct ConstDefStmt {
    pub name: String,
    pub init: Box<LiteralExpr>
}

#[derive(Debug, PartialEq, Clone)]
pub struct BlockStmt {
    pub stmts: Vec<Stmt>
}

#[derive(Debug, PartialEq, Clone)]
pub struct FuncDefStmt {
    pub name: String,
    pub params: Vec<String>,
    pub block: Box<Stmt>,
}

#[derive(Debug, PartialEq, Clone)]
pub enum DefStmt {
    FuncDef(FuncDefStmt),
    ConstDef(ConstDefStmt),
}

#[derive(Debug, PartialEq, Clone)]
pub struct IfStmt {
    pub condition: Box<Expr>,
    pub then_block: Box<Stmt>,
    pub else_block: Box<Stmt>,
}

#[derive(Debug, PartialEq, Clone)]
pub enum Stmt {
    Bind(BindStmt),
    Def(DefStmt),
    Block(BlockStmt),
    Expr(Expr),
    If(IfStmt),

    EOF,
}

impl IntoBoxed for Stmt {
    fn boxed(self) -> Box<Self> {
        Box::new(self)
    }
}

#[derive(Debug)]
pub struct ProgramStmt {
    pub body: Vec<Stmt>
}

impl ProgramStmt {
    pub fn new() -> Self {
        Self {
            body: Vec::new(),
        }
    }
}