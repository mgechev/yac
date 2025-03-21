import { expect, test } from 'vitest'
import { Lexer, TokenType } from './lexer';

test('tokenize expressions', () => {
  const program = `
    function add(a, b) {
        return a + b
    }
    
    log(add(2, 3))
  `;

    const lexer = new Lexer();
    const tokens = lexer.tokenize(program);
    
    expect(tokens[0].type).toBe(TokenType.Keyword);
    expect(tokens[0].value).toBe('function');

    expect(tokens[1].type).toBe(TokenType.Identifier);
    expect(tokens[1].value).toBe('add');

    expect(tokens[2].type).toBe(TokenType.Paranthesis);
    expect(tokens[2].value).toBe('(');

    expect(tokens[3].type).toBe(TokenType.Identifier);
    expect(tokens[3].value).toBe('a');

    expect(tokens[4].type).toBe(TokenType.Operator);
    expect(tokens[4].value).toBe(',');

    expect(tokens[5].type).toBe(TokenType.Identifier);
    expect(tokens[5].value).toBe('b');

    expect(tokens[6].type).toBe(TokenType.Paranthesis);
    expect(tokens[6].value).toBe(')');

    expect(tokens[7].type).toBe(TokenType.Brace);
    expect(tokens[7].value).toBe('{');

    expect(tokens[8].type).toBe(TokenType.Keyword);
    expect(tokens[8].value).toBe('return');

    expect(tokens[9].type).toBe(TokenType.Identifier);
    expect(tokens[9].value).toBe('a');

    expect(tokens[10].type).toBe(TokenType.Operator);
    expect(tokens[10].value).toBe('+');

    expect(tokens[11].type).toBe(TokenType.Identifier);
    expect(tokens[11].value).toBe('b');

    expect(tokens[12].type).toBe(TokenType.Brace);
    expect(tokens[12].value).toBe('}');

    expect(tokens[13].type).toBe(TokenType.Identifier);
    expect(tokens[13].value).toBe('log');

    expect(tokens[14].type).toBe(TokenType.Paranthesis);
    expect(tokens[14].value).toBe('(');

    expect(tokens[15].type).toBe(TokenType.Identifier);
    expect(tokens[15].value).toBe('add');

    expect(tokens[16].type).toBe(TokenType.Paranthesis);
    expect(tokens[16].value).toBe('(');

    expect(tokens[17].type).toBe(TokenType.Number);
    expect(tokens[17].value).toBe('2');

    expect(tokens[18].type).toBe(TokenType.Operator);
    expect(tokens[18].value).toBe(',');

    expect(tokens[19].type).toBe(TokenType.Number);
    expect(tokens[19].value).toBe('3');

    expect(tokens[20].type).toBe(TokenType.Paranthesis);
    expect(tokens[20].value).toBe(')');

    expect(tokens[21].type).toBe(TokenType.Paranthesis);
    expect(tokens[21].value).toBe(')');
});

test('tokenize conditional statements and loops', () => { 
    const program = `
    if (a > b) {
      log(a)
    } else {
      log(b)
    }
    
    while (a > 0) {
      a = a - 1
    }
    `;

    const lexer = new Lexer();
    const tokens = lexer.tokenize(program);

    expect(tokens[0].type).toBe(TokenType.Keyword);
    expect(tokens[0].value).toBe('if');

    expect(tokens[1].type).toBe(TokenType.Paranthesis);
    expect(tokens[1].value).toBe('(');

    expect(tokens[2].type).toBe(TokenType.Identifier);
    expect(tokens[2].value).toBe('a');

    expect(tokens[3].type).toBe(TokenType.Operator);
    expect(tokens[3].value).toBe('>');

    expect(tokens[4].type).toBe(TokenType.Identifier);
    expect(tokens[4].value).toBe('b');

    expect(tokens[5].type).toBe(TokenType.Paranthesis);
    expect(tokens[5].value).toBe(')');

    expect(tokens[6].type).toBe(TokenType.Brace);
    expect(tokens[6].value).toBe('{');

    expect(tokens[7].type).toBe(TokenType.Identifier);
    expect(tokens[7].value).toBe('log');

    expect(tokens[8].type).toBe(TokenType.Paranthesis);
    expect(tokens[8].value).toBe('(');

    expect(tokens[9].type).toBe(TokenType.Identifier);
    expect(tokens[9].value).toBe('a');

    expect(tokens[10].type).toBe(TokenType.Paranthesis);
    expect(tokens[10].value).toBe(')');

    expect(tokens[11].type).toBe(TokenType.Brace);
    expect(tokens[11].value).toBe('}');

    expect(tokens[12].type).toBe(TokenType.Keyword);
    expect(tokens[12].value).toBe('else');

    expect(tokens[13].type).toBe(TokenType.Brace);
    expect(tokens[13].value).toBe('{');

    expect(tokens[14].type).toBe(TokenType.Identifier);
    expect(tokens[14].value).toBe('log');

    expect(tokens[15].type).toBe(TokenType.Paranthesis);
    expect(tokens[15].value).toBe('(');

    expect(tokens[16].type).toBe(TokenType.Identifier);
    expect(tokens[16].value).toBe('b');

    expect(tokens[17].type).toBe(TokenType.Paranthesis);
    expect(tokens[17].value).toBe(')');

    expect(tokens[18].type).toBe(TokenType.Brace);
    expect(tokens[18].value).toBe('}');

    expect(tokens[19].type).toBe(TokenType.Keyword);
    expect(tokens[19].value).toBe('while');

    expect(tokens[20].type).toBe(TokenType.Paranthesis);
    expect(tokens[20].value).toBe('(');

    expect(tokens[21].type).toBe(TokenType.Identifier);
    expect(tokens[21].value).toBe('a');

    expect(tokens[22].type).toBe(TokenType.Operator);
    expect(tokens[22].value).toBe('>');

    expect(tokens[23].type).toBe(TokenType.Number);
    expect(tokens[23].value).toBe('0');

    expect(tokens[24].type).toBe(TokenType.Paranthesis);
    expect(tokens[24].value).toBe(')');

    expect(tokens[25].type).toBe(TokenType.Brace);
    expect(tokens[25].value).toBe('{');

    expect(tokens[26].type).toBe(TokenType.Identifier);
    expect(tokens[26].value).toBe('a');

    expect(tokens[27].type).toBe(TokenType.Operator);
    expect(tokens[27].value).toBe('=');

    expect(tokens[28].type).toBe(TokenType.Identifier);
    expect(tokens[28].value).toBe('a');

    expect(tokens[29].type).toBe(TokenType.Operator);
    expect(tokens[29].value).toBe('-');

    expect(tokens[30].type).toBe(TokenType.Number);
    expect(tokens[30].value).toBe('1');

    expect(tokens[31].type).toBe(TokenType.Brace);
    expect(tokens[31].value).toBe('}');
});