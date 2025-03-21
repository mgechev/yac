import { expect, test } from 'vitest'
import { Lexer, TokenType } from './lexer';

test('tokenize expressions', () => {
  const program = `
  (1 + 2) * 3.14
  `;
  const lexer = new Lexer();
  const tokens = lexer.tokenize(program);

  expect(tokens[0].type).toBe(TokenType.Parenthesis);
  expect(tokens[0].value).toBe('(');

  expect(tokens[1].type).toBe(TokenType.Number);
  expect(tokens[1].value).toBe('1');

  expect(tokens[2].type).toBe(TokenType.Operator);
  expect(tokens[2].value).toBe('+');

  expect(tokens[3].type).toBe(TokenType.Number);
  expect(tokens[3].value).toBe('2');

  expect(tokens[4].type).toBe(TokenType.Parenthesis);
  expect(tokens[4].value).toBe(')');

  expect(tokens[5].type).toBe(TokenType.Operator);
  expect(tokens[5].value).toBe('*');

  expect(tokens[6].type).toBe(TokenType.Number);
  expect(tokens[6].value).toBe('3.14');

});

test('tokenize functions', () => {
  const program = `
    function add(a, b) {
        return a + b
    }
  `;
  const lexer = new Lexer();
  const tokens = lexer.tokenize(program);

  expect(tokens[0].type).toBe(TokenType.Keyword);
  expect(tokens[0].value).toBe('function');

  expect(tokens[1].type).toBe(TokenType.Identifier);
  expect(tokens[1].value).toBe('add');

  expect(tokens[2].type).toBe(TokenType.Parenthesis);
  expect(tokens[2].value).toBe('(');

  expect(tokens[3].type).toBe(TokenType.Identifier);
  expect(tokens[3].value).toBe('a');

  expect(tokens[4].type).toBe(TokenType.Operator);
  expect(tokens[4].value).toBe(',');

  expect(tokens[5].type).toBe(TokenType.Identifier);
  expect(tokens[5].value).toBe('b');

  expect(tokens[6].type).toBe(TokenType.Parenthesis);
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
});

test('tokenize variables', () => {
  const program = `
    let a = 1 + 2
  `;

  const lexer = new Lexer();
  const tokens = lexer.tokenize(program);

  expect(tokens[0].type).toBe(TokenType.Keyword);
  expect(tokens[0].value).toBe('let');

  expect(tokens[1].type).toBe(TokenType.Identifier);
  expect(tokens[1].value).toBe('a');

  expect(tokens[2].type).toBe(TokenType.Operator);
  expect(tokens[2].value).toBe('=');


  expect(tokens[3].type).toBe(TokenType.Number);
  expect(tokens[3].value).toBe('1');

  expect(tokens[4].type).toBe(TokenType.Operator);
  expect(tokens[4].value).toBe('+');

  expect(tokens[5].type).toBe(TokenType.Number);
  expect(tokens[5].value).toBe('2');
});

test('tokenize conditional statements', () => {
  const program = `
    if (a > b) {
      return a
    } else {
      return b
    }
  `;

  const lexer = new Lexer();
  const tokens = lexer.tokenize(program);

  expect(tokens[0].type).toBe(TokenType.Keyword);
  expect(tokens[0].value).toBe('if');

  expect(tokens[1].type).toBe(TokenType.Parenthesis);
  expect(tokens[1].value).toBe('(');

  expect(tokens[2].type).toBe(TokenType.Identifier);
  expect(tokens[2].value).toBe('a');

  expect(tokens[3].type).toBe(TokenType.Operator);
  expect(tokens[3].value).toBe('>');

  expect(tokens[4].type).toBe(TokenType.Identifier);
  expect(tokens[4].value).toBe('b');

  expect(tokens[5].type).toBe(TokenType.Parenthesis);
  expect(tokens[5].value).toBe(')');

  expect(tokens[6].type).toBe(TokenType.Brace);
  expect(tokens[6].value).toBe('{');

  expect(tokens[7].type).toBe(TokenType.Keyword);
  expect(tokens[7].value).toBe('return');

  expect(tokens[8].type).toBe(TokenType.Identifier);
  expect(tokens[8].value).toBe('a');

  expect(tokens[9].type).toBe(TokenType.Brace);
  expect(tokens[9].value).toBe('}');

  expect(tokens[10].type).toBe(TokenType.Keyword);
  expect(tokens[10].value).toBe('else');

  expect(tokens[11].type).toBe(TokenType.Brace);
  expect(tokens[11].value).toBe('{');
  
  expect(tokens[12].type).toBe(TokenType.Keyword);
  expect(tokens[12].value).toBe('return');

  expect(tokens[13].type).toBe(TokenType.Identifier);
  expect(tokens[13].value).toBe('b');

  expect(tokens[14].type).toBe(TokenType.Brace);
  expect(tokens[14].value).toBe('}');
});

test('tokenize loops', () => {
  const program = `
    while (a < b) {
      return a
    }`;

  const lexer = new Lexer();
  const tokens = lexer.tokenize(program);

  expect(tokens[0].type).toBe(TokenType.Keyword);
  expect(tokens[0].value).toBe('while');

  expect(tokens[1].type).toBe(TokenType.Parenthesis);
  expect(tokens[1].value).toBe('(');

  expect(tokens[2].type).toBe(TokenType.Identifier);
  expect(tokens[2].value).toBe('a');

  expect(tokens[3].type).toBe(TokenType.Operator);
  expect(tokens[3].value).toBe('<');

  expect(tokens[4].type).toBe(TokenType.Identifier);
  expect(tokens[4].value).toBe('b');

  expect(tokens[5].type).toBe(TokenType.Parenthesis);
  expect(tokens[5].value).toBe(')');

  expect(tokens[6].type).toBe(TokenType.Brace);
  expect(tokens[6].value).toBe('{');

  expect(tokens[7].type).toBe(TokenType.Keyword);
  expect(tokens[7].value).toBe('return');

  expect(tokens[8].type).toBe(TokenType.Identifier);
  expect(tokens[8].value).toBe('a');

  expect(tokens[9].type).toBe(TokenType.Brace);
  expect(tokens[9].value).toBe('}');
})