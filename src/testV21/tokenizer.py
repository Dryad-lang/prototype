"""
Dryad lang tokenizer


    // Keywords
    {name:"LX_IF", rx:'if'},
    {name:"LX_ELSE", rx:'else'},
    {name:"LX_WHILE", rx:'while'},
    {name:"LX_DO", rx:'do'},
    {name:"LX_FOR", rx:'for'},
    {name:"LX_FUNC", rx:'function'},
    {name:"LX_VAR", rx:'var'},
    {name:"LX_RETURN", rx:'return'},
    {name:"LX_IMPORT", rx:'import'},
    {name:"LX_EXPORT", rx:'export'},
    {name:"LX_AS", rx:'as'},

    // Constants
    {name:"LX_ID", rx:'[a-zA-Z_][a-zA-Z0-9_]*'},
    {name:"LX_NUMBER", rx:'[0-9]+(\\.[0-9]*)?'},
    {name:"LX_STRING", rx:'"(\\\\"|[^"])*"|' + "'(\\\\'|[^'])*'"},

    // Punctuation
    {name:"LX_LPAREN", rx:'\\('},
    {name:"LX_RPAREN", rx:'\\)'},
    {name:"LX_LCURLY", rx:'\\{'},
    {name:"LX_RCURLY", rx:'\\}'},
    {name:"LX_LBRACKET", rx:'\\['},
    {name:"LX_RBRACKET", rx:'\\]'},
    {name:"LX_SEMICOLON", rx:';'},
    {name:"LX_COLON", rx:':'},
    {name:"LX_COMMA", rx:','},
    {name:"LX_DOT", rx:'\\.'},

    // Logical
    {name:"LX_LAND", rx:'&&'},
    {name:"LX_LOR", rx:'\\|\\|'},

    // Special assign
    {name:"LX_PLUSSET", rx:'\\+='},
    {name:"LX_MINUSSET", rx:'-='},
    {name:"LX_MULTSET", rx:'\\*='},
    {name:"LX_DIVSET", rx:'/='},
    {name:"LX_MODULOSET", rx:'%='},
    {name:"LX_ANDSET", rx:'&='},
    {name:"LX_ORSET", rx:'\\|='},
    {name:"LX_XORSET", rx:'\\^='},
    {name:"LX_LSHIFTSET", rx:'<<='},
    {name:"LX_RSHIFTSET", rx:'>>='},

    // Binary
    {name:"LX_AND", rx:'&'},
    {name:"LX_OR", rx:'\\|'},
    {name:"LX_XOR", rx:'\\^'},
    {name:"LX_NOT", rx:'~'},
    {name:"LX_LSHIFT", rx:'<<'},
    {name:"LX_RSHIFT", rx:'>>'},

    // Comparison
    {name:"LX_EQ", rx:'=='},
    {name:"LX_NEQ", rx:'!='},
    {name:"LX_LE", rx:'<='},
    {name:"LX_GE", rx:'>='},
    {name:"LX_LT", rx:'<'},
    {name:"LX_GT", rx:'>'},

    // Logical not
    {name:"LX_LNOT", rx:'!'},

    // Assignment
    {name:"LX_ASSIGN", rx:'='},

    // Operators
    {name:"LX_INC", rx:'\\+\\+'},
    {name:"LX_DEC", rx:'--'},
    {name:"LX_POW", rx:'\\*\\*'},
    {name:"LX_PLUS", rx:'\\+'},
    {name:"LX_MINUS", rx:'-'},
    {name:"LX_MULT", rx:'\\*'},
    {name:"LX_DIV", rx:'/'},
    {name:"LX_MODULO", rx:'%'}

"""

import re
import sys
import os
import logging
import json
import io
import traceback
import copy
import time
import datetime
import argparse
import pprint
import collections


# Path: tokenizer.py
"""
Class tokenizer for Dryad lang

Main function: tokenize

Tokenize line by line so the class need a function to split the code in lines

The class will be an chain of responsibility 

Main
    |-> Split Lines
|-> Test line chain (main of the chain)
        |-> Is a special char? (n\, \t, \r, \f \0 ...) case yes, do the function/return token and go to main
                                                       case apliable, case no pass to the link of chain
                    |-> Is a comment? case yes, ignore and return to main
                            |-> Is a space? case yes, ignore and return to main
                                    |-> Is an aplyable token? case yes, return token and return to main
                                            |-> Reached here? case yes, error and return to main

This way the code will be more readable and easy to maintain

Chain link class:

- name: name of the link
- next: next link in the chain
- stream: stream of chars to read passed link to link
- token: token to return
- rule() -> Return do the rule of the current link
- next( stream ) -> Pass the current stream to the next link
- set_error() -> Set the error of the current link
    | The errors is stored in a global variable that will be checked at the end of the process
      case there is an error the process will be stopped and the error will be printed
      there will be two global variables, one for the error and other for the flag 
      the flag will be an boolean that will be set to true when an error is found and is checked 
      at the end of the process thi way we save memory and time by not checking the error and just 
      checking the flag

Stream class:
Class to manage the stream of chars to read

- stream: stream of chars to read
- pos: current position of the stream
- next() -> Return the next char in the stream
- peek() -> Return the next char in the stream without moving the pointer
- eof() -> Return true if the stream is at the end


Token stack class:
Class to manage the tokens generated

- tokens: tokens generated
- pos: current position of the stack
- push( token ) -> Push a token to the stack
- pop() -> Pop a token from the stack (last token)
- shift() -> Shift a token from the stack (first token)
- peek() -> Peek a token from the stack (last token)
- peek_first() -> Peek a token from the stack (first token)
- get() -> Return the tokens generated
- advance() -> Advance the pointer of the stack
- current() -> Return the current token
- prev() -> Return the previous token
- next() -> Return the next token
- reverse() -> Reverse the stack
- purge() -> Purge the stack
- bof() -> Return true if the stack is at the begining
- eos() -> Return true if the stack is at the end

Tokenizer class:

- lines: lines of code to tokenize
- tokens: tokens generated
- line: current line

- tokenize() -> Tokenize the lines of code
- split_lines() -> Split the code in lines
- test_line() -> Test the current line
    | This function will call the first link of the chain


"""


# Path: tokenizer.py


# Global variables
# Error
# Error flag
# LX_RULES <- List with the lxname and lxregex
# LX_RULES_DICT <- Dict with the lxname and lxregex

ERR = []
ERR_FLAG = False
LX_RULES = []
LX_RULES_DICT = {
    "LX_IF": "if",
    "LX_ELSE": "else",
    "LX_WHILE": "while",
    "LX_DO": "do",
    "LX_FOR": "for",
    "LX_FUNC": "function",
    "LX_VAR": "var",
    "LX_RETURN": "return",
    "LX_IMPORT": "import",
    "LX_EXPORT": "export",
    "LX_AS": "as",
    "LX_ID": "[a-zA-Z_][a-zA-Z0-9_]*",
    "LX_NUMBER": "[0-9]+(\\.[0-9]*)?",
    "LX_STRING": '"(\\\\"|[^"])*"|' + "'(\\\\'|[^'])*'",
    "LX_LPAREN": "\\(",
    "LX_RPAREN": "\\)",
    "LX_LCURLY": "\\{",
    "LX_RCURLY": "\\}",
    "LX_LBRACKET": "\\[",
    "LX_RBRACKET": "\\]",
    "LX_SEMICOLON": ";",
    "LX_COLON": ":",
    "LX_COMMA": ",",
    "LX_DOT": "\\.",
    "LX_LAND": "&&",
    "LX_LOR": "\\|\\|",
    "LX_PLUSSET": "\\+=",
    "LX_MINUSSET": "-=",
    "LX_MULTSET": "\\*=",
    "LX_DIVSET": "/=",
    "LX_MODULOSET": "%=",
    "LX_ANDSET": "&=",
    "LX_ORSET": "\\|=",
    "LX_XORSET": "\\^=",
    "LX_LSHIFTSET": "<<=",
    "LX_RSHIFTSET": ">>=",
    "LX_AND": "&",
    "LX_OR": "\\|",
    "LX_XOR": "\\^",
    "LX_NOT": "~",
    "LX_LSHIFT": "<<",
    "LX_RSHIFT": ">>",
    "LX_EQ": "==",
    "LX_NEQ": "!=",
    "LX_LE": "<=",
    "LX_GE": ">=",
    "LX_LT": "<",
    "LX_GT": ">",
    "LX_LNOT": "!",
    "LX_ASSIGN": "=",
    "LX_INC": "\\+\\+",
    "LX_DEC": "--",
    "LX_POW": "\\*\\*",
    "LX_PLUS": "\\+",
    "LX_MINUS": "-",
    "LX_MULT": "\\*",
    "LX_DIV": "/",
    "LX_MODULO": "%"
}


class Stream:
    """
    Class to manage the stream of chars to read

    - stream: stream of chars to read
    - pos: current position of the stream
    - next() -> Return the next char in the stream
    - peek() -> Return the next char in the stream without moving the pointer
    - eof() -> Return true if the stream is at the end
    """

    def __init__(self, stream):
        self.stream = stream
        self.pos = 0

    def next(self):
        """
        Return the next char in the stream
        """
        self.pos += 1
        return self.stream[self.pos - 1]

    def peek(self):
        """
        Return the next char in the stream without moving the pointer
        """
        return self.stream[self.pos]

    def eof(self):
        """
        Return true if the stream is at the end
        """
        return self.pos >= len(self.stream)
    
    def get(self):
        """
        Return the stream
        """
        return self.stream
    
    def get_pos(self):
        """
        Return the current position of the stream
        """
        return self.pos
    
    def set_pos(self, pos):
        """
        Set the current position of the stream
        """
        self.pos = pos

    def slice(self, start, end):
        """
        Slice the stream
        """
        return self.stream[start:end]


# Tests
# stream = Stream("test")
# print("Stream: ", stream.get())
# print("Next: ", stream.next())
# print("Peek: ", stream.peek())
# print("Eof: ", stream.eof())
# print("Pos: ", stream.get_pos())
# stream.set_pos(2)
# print("Pos: ", stream.get_pos())
# print("Slice: ", stream.slice(0, 2))


class TokenStack:
    """
    Class to manage the tokens generated

    - tokens: tokens generated
    - pos: current position of the stack
    - push( token ) -> Push a token to the stack
    - pop() -> Pop a token from the stack (last token)
    - shift() -> Shift a token from the stack (first token)
    - peek() -> Peek a token from the stack (last token)
    - peek_first() -> Peek a token from the stack (first token)
    - get() -> Return the tokens generated
    - advance() -> Advance the pointer of the stack
    - current() -> Return the current token
    - prev() -> Return the previous token
    - next() -> Return the next token
    - reverse() -> Reverse the stack
    - purge() -> Purge the stack
    - bof() -> Return true if the stack is at the begining
    - eos() -> Return true if the stack is at the end
    """

    def __init__(self):
        self.tokens = []
        self.pos = 0

    def push(self, token):
        """
        Push a token to the stack
        """
        self.tokens.append(token)

    def pop(self):
        """
        Pop a token from the stack (last token)
        """
        return self.tokens.pop()

    def shift(self):
        """
        Shift a token from the stack (first token)
        """
        return self.tokens.pop(0)

    def peek(self):
        """
        Peek a token from the stack (last token)
        """
        return self.tokens[-1]

    def peek_first(self):
        """
        Peek a token from the stack (first token)
        """
        return self.tokens[0]

    def get(self):
        """
        Return the tokens generated
        """
        return self.tokens

    def advance(self):
        """
        Advance the pointer of the stack
        """
        self.pos += 1

    def current(self):
        """
        Return the current token
        """
        return self.tokens[self.pos]

    def prev(self):
        """
        Return the previous token
        """
        return self.tokens[self.pos - 1]

    def next(self):
        """
        Return the next token
        """
        return self.tokens[self.pos + 1]

    def reverse(self):
        """
        Reverse the stack
        """
        self.tokens.reverse()

    def purge(self):
        """
        Purge the stack
        """
        self.tokens = []

    def bof(self):
        """
        Return true if the stack is at the begining
        """
        return self.pos == 0
    
    def eos(self):
        """
        Return true if the stack is at the end
        """
        return self.pos >= len(self.tokens)
    
    def get_pos(self):
        """
        Return the current position of the stack
        """
        return self.pos
    
    def set_pos(self, pos):
        """
        Set the current position of the stack
        """
        self.pos = pos


# Tests
token_stack = TokenStack()
# token_stack.push("test")
# print("Token stack: ", token_stack.get())
# print("Pop: ", token_stack.pop())
# token_stack.push("test")
# print("Shift: ", token_stack.shift())
# token_stack.push("test")
# print("Peek: ", token_stack.peek())
# print("Peek first: ", token_stack.peek_first())
# print("Get: ", token_stack.get())
# token_stack.advance()
# print("Current: ", token_stack.current())
# print("Prev: ", token_stack.prev())
# print("Next: ", token_stack.next())
# token_stack.reverse()
# print("Reverse: ", token_stack.get())
# token_stack.purge()
# print("Purge: ", token_stack.get())
# print("Bof: ", token_stack.bof())
# print("Eos: ", token_stack.eos())
# token_stack.set_pos(2)
# print("Pos: ", token_stack.get_pos())
