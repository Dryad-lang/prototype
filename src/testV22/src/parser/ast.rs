
pub trait IntoBoxed {
    fn boxed(self) -> Box<Self>;
}

#[derive(Debug)]
pub enum BinOp {
    Add,
    Sum,
    Mult,
    Div
}

#[derive(Debug)]
pub enum UnOp {
    Inc,
    Dec
}

#[derive(Debug)]
pub struct BinExpr {
    pub left: Box<Expr>,
    pub op: BinOp,
    pub right: Box<Expr>
}

#[derive(Debug)]
pub struct CallExpr {
    pub fn_name: Box<Expr>,
    pub args: Vec<Box<Expr>>
}

#[derive(Debug)]
pub struct StrLit {
    pub value: String,
}

#[derive(Debug)]
pub struct NumLit {
    pub value: f64,
}

#[derive(Debug)]
pub struct IdLit {
    pub value: String,
}

#[derive(Debug)]
pub enum LiteralExpr {
    StrLit(StrLit),
    NumLit(NumLit),
    IdLit(IdLit)
}

#[derive(Debug)]
pub struct UnaryExpr {
    pub op: UnOp,
    pub expr: Box<Expr>,
}

#[derive(Debug)]
pub struct DebugExpr {
    pub value: String,
}

#[derive(Debug)]
pub enum Expr {
    Bin(BinExpr),
    Call(CallExpr),
    Literal(LiteralExpr),
    Unary(UnaryExpr),
    Debug(DebugExpr),
}

impl IntoBoxed for Expr {
    fn boxed(self) -> Box<Self> {
        Box::new(self)
    }
}

#[derive(Debug)]
pub struct BindStmt {
    pub name: String,
    pub init: Option<Box<Expr>>,
}

#[derive(Debug)]
pub struct ConstDefStmt {
    pub name: String,
    pub init: Box<LiteralExpr>
}

#[derive(Debug)]
pub struct BlockStmt {
    pub stmts: Vec<Stmt>
}

#[derive(Debug)]
pub struct FuncDefStmt {
    pub name: String,
    pub params: Vec<String>,
    pub block: Box<Stmt>,
}

#[derive(Debug)]
pub enum DefStmt {
    FuncDef(FuncDefStmt),
    ConstDef(ConstDefStmt),
}

#[derive(Debug)]
pub struct IfStmt {
    pub condition: Box<Expr>,
    pub then_block: Box<Stmt>,
    pub else_block: Box<Stmt>,
}

#[derive(Debug)]
pub enum Stmt {
    Bind(BindStmt),
    Def(DefStmt),
    Block(BlockStmt),
    Expr(Expr),
    If(IfStmt)
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