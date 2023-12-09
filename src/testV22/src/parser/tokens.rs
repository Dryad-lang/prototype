use std::fmt::Debug;

macro_rules! token_dbg_str { 
    () => { "[TokenType: \"{}\"]" }; 
}

#[derive(PartialEq, Clone)]
pub enum TokenType {
    // Keywords
    LxIf,     LxElse,   LxConst,
    LxWhile,  LxDo,     LxFor,
    LxFunc,   LxVar,    LxReturn,
    LxImport, LxExport, LxAs,

    // Constants
    LxId, LxNumber,
    LxString, LxBool,

    // Punctuation
    LxLParen,    LxRParen,
    LxLCurly,    LxRCurly,
    LxLBracket,  LxRBracket,
    LxSemiColon, LxColon,
    LxComma,     LxDot,

    // Logical
    LxLAnd, LxLOr,
    LxLNot,

    // Comparison
    LxEq, LxNeq,
    LxLe, LxGe,
    LxLt, LxGt,

    // Bitwise
    LxAnd,    LxOr,
    LxXor,    LxNot,
    LxLShift, LxRShift,

    // Assignment
    LxAssign,

    // Special assign
    LxPlusSet,   LxMinusSet,
    LxMultSet,   LxDivSet,   LxModSet, 
    LxAndSet,    LxOrSet,    LxXorSet,
    LxLShiftSet, LxRShiftSet,

    // Binary operators
    LxInc,  LxDec,
    LxPlus, LxMinus,
    LxMult, LxDiv,   LxMod,
    LxPow,

    // Special tokens
    LxEmpty, LxInvalid
}

impl From<&str> for TokenType {
    #[inline]
    fn from<'a>(value: &'a str) -> Self {
        match value {
            "if"     => Self::LxIf,
            "else"   => Self::LxElse,
            "while"  => Self::LxWhile,
            "do"     => Self::LxDo,
            "for"    => Self::LxFor,
            "func"   => Self::LxFunc,
            "var"    => Self::LxVar,
            "const"  => Self::LxConst,
            "return" => Self::LxReturn,
            "import" => Self::LxImport,
            "export" => Self::LxExport,
            "as"     => Self::LxAs,

            "&&" => Self::LxLAnd,
            "&"  => Self::LxAnd,
            "||" => Self::LxLOr,
            "|"  => Self::LxOr,
            "!"  => Self::LxLNot,
            "~"  => Self::LxNot,

            "==" => Self::LxEq,
            "!=" => Self::LxNeq,
            ">=" => Self::LxGt,
            "<=" => Self::LxLt,
            ">"  => Self::LxGe,
            "<"  => Self::LxLe,

            "=" => Self::LxAssign,

            "++" => Self::LxInc,
            "+"  => Self::LxPlus,
            "--" => Self::LxDec,
            "-"  => Self::LxMinus,
            "**" => Self::LxPow,
            "*"  => Self::LxMult,
            "/"  => Self::LxDiv,
            "//" => Self::LxInvalid,
 
            _ => Self::LxId,
        }
    }
}

impl Debug for TokenType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::LxIf        => write!(f, "{}", format!(token_dbg_str!(), "IF")),
            Self::LxElse      => write!(f, "{}", format!(token_dbg_str!(), "ELSE")),
            Self::LxWhile     => write!(f, "{}", format!(token_dbg_str!(), "WHILE")),
            Self::LxDo        => write!(f, "{}", format!(token_dbg_str!(), "DO")),
            Self::LxFor       => write!(f, "{}", format!(token_dbg_str!(), "FOR")),
            Self::LxFunc      => write!(f, "{}", format!(token_dbg_str!(), "FUNCTION")),
            Self::LxVar       => write!(f, "{}", format!(token_dbg_str!(), "VARIABLE")),
            Self::LxReturn    => write!(f, "{}", format!(token_dbg_str!(), "RETURN")),
            Self::LxImport    => write!(f, "{}", format!(token_dbg_str!(), "IMPORT")),
            Self::LxExport    => write!(f, "{}", format!(token_dbg_str!(), "EXPORT")),
            Self::LxAs        => write!(f, "{}", format!(token_dbg_str!(), "AS")),
            Self::LxId        => write!(f, "{}", format!(token_dbg_str!(), "IDENTIFICATOR")),
            Self::LxNumber    => write!(f, "{}", format!(token_dbg_str!(), "NUMBER LITERAL")),
            Self::LxString    => write!(f, "{}", format!(token_dbg_str!(), "STRING LITERAL")),
            Self::LxLParen    => write!(f, "{}", format!(token_dbg_str!(), "LEFT PARENTHESIS")),
            Self::LxRParen    => write!(f, "{}", format!(token_dbg_str!(), "RIGHT PARENTHESIS")),
            Self::LxLCurly    => write!(f, "{}", format!(token_dbg_str!(), "LEFT CURLY")),
            Self::LxRCurly    => write!(f, "{}", format!(token_dbg_str!(), "RIGHT CURLY")),
            Self::LxLBracket  => write!(f, "{}", format!(token_dbg_str!(), "LEFT BRACKET")),
            Self::LxRBracket  => write!(f, "{}", format!(token_dbg_str!(), "RIGHT BRACKET")),
            Self::LxSemiColon => write!(f, "{}", format!(token_dbg_str!(), "SEMICOLON")),
            Self::LxColon     => write!(f, "{}", format!(token_dbg_str!(), "COLON")),
            Self::LxComma     => write!(f, "{}", format!(token_dbg_str!(), "COMMA")),
            Self::LxDot       => write!(f, "{}", format!(token_dbg_str!(), "DOT")),
            Self::LxLAnd      => write!(f, "{}", format!(token_dbg_str!(), "LOGICAL AND")),
            Self::LxLOr       => write!(f, "{}", format!(token_dbg_str!(), "LOGICAL OR")),
            Self::LxLNot      => write!(f, "{}", format!(token_dbg_str!(), "LOGICAL NOT")),
            Self::LxEq        => write!(f, "{}", format!(token_dbg_str!(), "COMPARISON EQUAL")),
            Self::LxNeq       => write!(f, "{}", format!(token_dbg_str!(), "COMPARISON NOT EQUAL")),
            Self::LxLe        => write!(f, "{}", format!(token_dbg_str!(), "COMPARISON LESSER")),
            Self::LxGe        => write!(f, "{}", format!(token_dbg_str!(), "COMPARISON GREATER")),
            Self::LxLt        => write!(f, "{}", format!(token_dbg_str!(), "COMPARISON LESSER THAN")),
            Self::LxGt        => write!(f, "{}", format!(token_dbg_str!(), "COMPARISON GREATER THAN")),
            Self::LxAnd       => write!(f, "{}", format!(token_dbg_str!(), "BITWISE AND")),
            Self::LxOr        => write!(f, "{}", format!(token_dbg_str!(), "BITWISE OR")),
            Self::LxXor       => write!(f, "{}", format!(token_dbg_str!(), "BITWISE XOR")),
            Self::LxNot       => write!(f, "{}", format!(token_dbg_str!(), "BITWISE NOT")),
            Self::LxLShift    => write!(f, "{}", format!(token_dbg_str!(), "BITWISE LEFT SHIFT")),
            Self::LxRShift    => write!(f, "{}", format!(token_dbg_str!(), "BITWISE RIGHT SHIFT")),
            Self::LxAssign    => write!(f, "{}", format!(token_dbg_str!(), "ASSIGNMENT")),
            Self::LxPlusSet   => write!(f, "{}", format!(token_dbg_str!(), "PLUS ASSIGNMENT")),
            Self::LxMinusSet  => write!(f, "{}", format!(token_dbg_str!(), "MINUS ASSIGNMENT")),
            Self::LxMultSet   => write!(f, "{}", format!(token_dbg_str!(), "MULTIPLICATION ASSIGNMENT")),
            Self::LxDivSet    => write!(f, "{}", format!(token_dbg_str!(), "DIVISION ASSIGNMENT")),
            Self::LxModSet    => write!(f, "{}", format!(token_dbg_str!(), "MODULO ASSIGNMENT")),
            Self::LxAndSet    => write!(f, "{}", format!(token_dbg_str!(), "AND ASSIGNMENT")),
            Self::LxOrSet     => write!(f, "{}", format!(token_dbg_str!(), "OR ASSIGNMENT")),
            Self::LxXorSet    => write!(f, "{}", format!(token_dbg_str!(), "XOR ASSIGNMENT")),
            Self::LxLShiftSet => write!(f, "{}", format!(token_dbg_str!(), "LEFT SHIFT ASSIGNMENT")),
            Self::LxRShiftSet => write!(f, "{}", format!(token_dbg_str!(), "RIGHT SHIFT ASSIGNMENT")),
            Self::LxInc       => write!(f, "{}", format!(token_dbg_str!(), "UNARY INCREASE")),
            Self::LxDec       => write!(f, "{}", format!(token_dbg_str!(), "UNARY DECREATE")),
            Self::LxPlus      => write!(f, "{}", format!(token_dbg_str!(), "BINARY PLUS")),
            Self::LxMinus     => write!(f, "{}", format!(token_dbg_str!(), "BINARY MINUS")),
            Self::LxMult      => write!(f, "{}", format!(token_dbg_str!(), "BINARY MULTIPLICATION")),
            Self::LxDiv       => write!(f, "{}", format!(token_dbg_str!(), "BINARY DIVISION")),
            Self::LxMod       => write!(f, "{}", format!(token_dbg_str!(), "BINARY MODULE")),
            Self::LxPow       => write!(f, "{}", format!(token_dbg_str!(), "BINARY POW")),
            Self::LxEmpty     => write!(f, "{}", format!(token_dbg_str!(), "EMPTY TOKEN")),
            Self::LxInvalid   => write!(f, "{}", format!(token_dbg_str!(), "INVALID TOKEN")),
            Self::LxConst     => write!(f, "{}", format!(token_dbg_str!(), "CONST TOKEN")),
            Self::LxBool      => write!(f, "{}", format!(token_dbg_str!(), "BOOL TOKEN")),
        }
    }
}

#[derive(Debug, PartialEq, Clone)]
pub struct Token {
    pub token_type: TokenType,
    pub lexeme: String,
    pub line: usize,
    pub column: usize,
}

impl Token {
    pub fn new(token_type: TokenType, lexeme: String, line: usize, column: usize) -> Self {
        Self {
            token_type,
            lexeme,
            line,
            column,
        }
    }

    pub fn new_from_lexeme(lexeme: String, line: usize, column: usize) -> Self {
        Self {
            token_type: TokenType::from(lexeme.as_str()),
            lexeme,
            line,
            column,
        }
    }
}