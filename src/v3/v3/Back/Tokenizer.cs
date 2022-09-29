using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using v3.back.objects;

namespace v3.back
{
    public class Tokenizer
    {
        private List<Token> _tokens = new List<Token>();
        private InternalTypes _internalTypes = new InternalTypes();
        private ErrorHandler _errorHandler = new ErrorHandler();
        private int _line;
        private int _column;
        private int _position;
        private string _rawtext = "";

        public void LineAdvance()
        {
            _line++;
            _column = 1;
        }

        public void ColumnAdvance()
        {
            _column++;
        }

        public void PositionAdvance()
        {
            _position++;
        }

        public List<Token> Tokenize(string rawtext)
        {
            if (string.IsNullOrEmpty(rawtext))
            {
                return _tokens;
            }
            else
            {
                _rawtext = rawtext;
                _line = 1;
                _column = 1;
                _position = 0;
            }
            while (_position < _rawtext.Length)
            {
                if (_rawtext[_position] == ' ' || _rawtext[_position] == '\t')
                {
                    PositionAdvance();
                    ColumnAdvance();
                }
                else if (_rawtext[_position] == '\r' || _rawtext[_position] == '\n')
                {
                    LineAdvance();
                    _position = 0;
                    _column = 1;
                }
                else if (_rawtext[_position] == '+')
                {
                    _tokens.Add(new Token(_internalTypes.TPlus, "+", new Info(_line, _column, _position)));
                    PositionAdvance();
                    ColumnAdvance();
                }
                else if (_rawtext[_position] == '-')
                {
                    _tokens.Add(new Token(_internalTypes.TMinus, "-", new Info(_line, _column, _position)));
                    PositionAdvance();
                    ColumnAdvance();
                }
                else if (_rawtext[_position] == '*')
                {
                    _tokens.Add(new Token(_internalTypes.TMultiply, "*", new Info(_line, _column, _position)));
                    PositionAdvance();
                    ColumnAdvance();
                }
                else if (_rawtext[_position] == '/')
                {
                    _tokens.Add(new Token(_internalTypes.TDivide, "/", new Info(_line, _column, _position)));
                    PositionAdvance();
                    ColumnAdvance();
                }
                else if (_rawtext[_position] == '(')
                {
                    _tokens.Add(new Token(_internalTypes.TLParen, "(", new Info(_line, _column, _position)));
                    PositionAdvance();
                    ColumnAdvance();
                }
                else if (_rawtext[_position] == ')')
                {
                    _tokens.Add(new Token(_internalTypes.TRParen, ")", new Info(_line, _column, _position)));
                    PositionAdvance();
                    ColumnAdvance();
                }
                else if (_internalTypes.INT_DIGITS.Contains(_rawtext[_position]))
                {
                    NumericValues numericValues = new NumericValues();
                    string value = "";
                    while ((
                            _internalTypes.INT_DIGITS.Contains(_rawtext[_position]) ||
                            _internalTypes.FLOAT_DIGITS.Contains(_rawtext[_position])
                        ) && _position < _rawtext.Length)
                    {
                        value += _rawtext[_position];
                        _tokens.Add(numericValues.MakeNumber(value, new Info(_line, _column, _position)));
                    }
                }
                else
                {
                    _errorHandler
                    .SetType(ErrorType.UnexpectedToken)
                    .SetToken(_rawtext[_position].ToString())
                    .SetInfo(new Info(_line, _column, _position))
                    .ThrowError();
                    return _tokens;
                }
            }
            return _tokens;
        }
    }
}