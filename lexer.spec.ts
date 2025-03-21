import { expect, test } from 'vitest'
import { Lexer, TokenType } from './lexer';

test('tokenize expressions', () => {
  const program = `
    function add(a b)
        return a + b
    
    let result = 3 + add(2 3)
    log(result)
  `;

    const lexer = new Lexer();
    const tokens = lexer.tokenize(program);
    expect(tokens[0].value).toBe('function');
    expect(tokens[0].type).toBe(TokenType.Keyword);
    expect(tokens[1].value).toBe('add');
    expect(tokens[1].type).toBe(TokenType.Identifier);
    expect(tokens[2].value).toBe('(');
    expect(tokens[2].type).toBe(TokenType.Paranthesis);
    expect(tokens[3].value).toBe('a');
    expect(tokens[3].type).toBe(TokenType.Identifier);
    expect(tokens[4].value).toBe('b');
    expect(tokens[4].type).toBe(TokenType.Identifier);
    expect(tokens[5].value).toBe(')');
    expect(tokens[5].type).toBe(TokenType.Paranthesis);
    expect(tokens[6].value).toBe('return');
    expect(tokens[6].type).toBe(TokenType.Keyword);
    expect(tokens[7].value).toBe('a');
    expect(tokens[7].type).toBe(TokenType.Identifier);
    expect(tokens[8].value).toBe('+');
    expect(tokens[8].type).toBe(TokenType.Operator);
    expect(tokens[9].value).toBe('b');
    expect(tokens[9].type).toBe(TokenType.Identifier);
    expect(tokens[10].value).toBe('let');
    expect(tokens[10].type).toBe(TokenType.Keyword);
    expect(tokens[11].value).toBe('result');
    expect(tokens[11].type).toBe(TokenType.Identifier);
    expect(tokens[12].value).toBe('=');
    expect(tokens[12].type).toBe(TokenType.Operator);
    expect(tokens[13].value).toBe('3');
    expect(tokens[13].type).toBe(TokenType.Number);
    expect(tokens[14].value).toBe('+');
    expect(tokens[14].type).toBe(TokenType.Operator);
    expect(tokens[15].value).toBe('add');
    expect(tokens[15].type).toBe(TokenType.Identifier);
    expect(tokens[16].value).toBe('(');
    expect(tokens[16].type).toBe(TokenType.Paranthesis);
    expect(tokens[17].value).toBe('2');
    expect(tokens[17].type).toBe(TokenType.Number);
    expect(tokens[18].value).toBe('3');
    expect(tokens[18].type).toBe(TokenType.Number);
    expect(tokens[19].value).toBe(')');
    expect(tokens[19].type).toBe(TokenType.Paranthesis);
    expect(tokens[20].value).toBe('log');
    expect(tokens[20].type).toBe(TokenType.Identifier);
    expect(tokens[21].value).toBe('(');
    expect(tokens[21].type).toBe(TokenType.Paranthesis);
    expect(tokens[22].value).toBe('result');
    expect(tokens[22].type).toBe(TokenType.Identifier);
    expect(tokens[23].value).toBe(')');
    expect(tokens[23].type).toBe(TokenType.Paranthesis);
})
