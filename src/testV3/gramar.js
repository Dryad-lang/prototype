/*
Gramar for language:

# Assingment
<assigment> ::= <var> "=" <value> ";"

# Value
<value> ::= <string> | <number> | <bool> | <null> | <var> | <function> | <object> | <array>

# String
<string> ::= '"' <string> '"' 

# Char
<char> ::= "'" <char> "'"

# Number
<number> ::= <int> | <float> | <double>

# Array
<array> ::= "[" <value> "," <value> "," <value> "]" ";"

# Object
<object> ::= "{" <var> ":" <value> "," <var> ":" <value> "," <var> ":" <value> "}" ";"

# Function
<function> ::= "function" <var> "(" <var> "," <var> "," <var> ")" "{" <code> "}" ";"

# Code
<code> ::= <assigment> | <if> | <for> | <while> | <do> | <return> | <print> | <try> | <throw> | <function> | <object>

# If
<if> ::= "if" "(" <value> ")" "{" <code> "}" ";"

# For
<for> ::= "for" "(" <assigment> <value> <assigment> ")" "{" <code> "}" ";"

# While
<while> ::= "while" "(" <value> ")" "{" <code> "}" ";"

# Do
<do> ::= "do" "{" <code> "}" "while" "(" <value> ")" ";"

# Return
<return> ::= "return" <value> ";"

# Try
<try> ::= "try" "{" <code> "}" "catch" "{" <code> "}" ";"

# Throw
<throw> ::= "throw" <value> ";"

# Var
<var> ::= <string> | <char> | <number> | <array> | <object> | <function> | <code>

# Null
<null> ::= "null"

# Bool
<bool> ::= "true" | "false"

# Import package
<import> ::= "using" <string> ";"

# Using a function
<using_function> ::= <var> "(" <value> "," <value> "," <value> ")" ";"

# Using a function in object
<using_function_object> ::= <var> "." <var> "(" <value> "," <value> "," <value> ")" ";"

# Import
<import> ::= "using" <string> ";"

------------------------------------------------------

Operators

+ - * / % ++ --
== != > < >= <=
&& || !
= += -= *= /= %=

------------------------------------------------------

Comments


------------------------------------------------------

Keyworlds


void
null
true
false
if
else
for
while
do
return
using
function
class
new
this
static
public
private
try
catch
throw
in
interface


Objects keyworlds:

class
new
this
static
public
private
interface

Procedure keyworlds:

function
return
void
try
catch
throw
in
int
string
bool
float
double
char
void
null
true
false
if
else
for
while
do
using

------------------------------------------------------

Data types

int
string
bool
float
double
char

------------------------------------------------------

Operators

+ - * / % ++ --
== != > < >= <=
&& || !
= += -= *= /= %=

------------------------------------------------------

Comments

// Comment

Comment

------------------------------------------------------

Functions

function add(int n1, int n2) {
    return n1 + n2;
}

------------------------------------------------------

Control flow

if ( number1 == 1) {
    number1 ++
};

for (int i = 0; i < 10; i++) {
    Console.WriteLine(i);
}

do{
    Console.WriteLine("Hello");
} while (number1 == 1);

while (number1 == 1) {
    Console.WriteLine("Hello");
}

------------------------------------------------------

Asignment

int number1 = 1;

------------------------------------------------------

Import package

using System;

------------------------------------------------------

Using a function / method

print("String");

------------------------------------------------------

Using a function in object

Console.writeLine("String");

------------------------------------------------------
*/ 