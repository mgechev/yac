import { expect, test } from "vitest";
import { Lexer } from "./lexer";
import { Parser } from "./parser";

test('should parse binary expressions', () => {
  const program = `
  (2 + 2) * 3
  `;
  const lexer = new Lexer();
  const tokens = lexer.tokenize(program);
  const parser = new Parser();
  const ast = parser.parse(tokens);

  expect(ast.type).toBe('Program');
  expect(ast.body.length).toBe(1);

  const body = ast.body[0] as any;

  expect(body.type).toBe('BinaryExpression');
  expect(body.operator.value).toBe('*');

  expect(body.left.type).toBe('BinaryExpression');
  expect(body.left.operator.value).toBe('+');

  expect(body.left.left.type).toBe('Number');
  expect(body.left.left.value).toBe(2);

  expect(body.left.right.type).toBe('Number');
  expect(body.left.right.value).toBe(2);

  expect(body.right.type).toBe('Number');
  expect(body.right.value).toBe(3);
});

test('should parse function declarations', () => {
  const program = `
  function add(a, b) {
    return a + b
  }
  `;

  const lexer = new Lexer();
  const tokens = lexer.tokenize(program);
  const parser = new Parser();
  const ast = parser.parse(tokens);

  expect(ast.type).toBe('Program');
  expect(ast.body.length).toBe(1);

  const funcDecl = ast.body[0] as any;

  expect(funcDecl.type).toBe('FunctionDeclaration');
  expect(funcDecl.name).toBe('add');
  expect(funcDecl.parameters.length).toBe(2);
  expect(funcDecl.parameters[0]).toBe('a');
  expect(funcDecl.parameters[1]).toBe('b');

  const funcBody = funcDecl.body as any;

  expect(funcBody[0].type).toBe('ReturnStatement');
  expect(funcBody[0].value.type).toBe('BinaryExpression');
  expect(funcBody[0].value.operator.value).toBe('+');
  expect(funcBody[0].value.left.type).toBe('Identifier');
  expect(funcBody[0].value.right.type).toBe('Identifier');
});

test('should parse conditional statements', () => {
  const program = `
  if (x > 10) {
    x
  } else {
    0
  }
  `;

  const lexer = new Lexer();
  const tokens = lexer.tokenize(program);
  const parser = new Parser();
  const ast = parser.parse(tokens);

  expect(ast.type).toBe('Program');
  expect(ast.body.length).toBe(1);

  const ifStatement = ast.body[0] as any;

  expect(ifStatement.type).toBe('IfStatement');
  expect(ifStatement.condition.type).toBe('BinaryExpression');
  expect(ifStatement.condition.operator.value).toBe('>');
  expect(ifStatement.condition.left.type).toBe('Identifier');
  expect(ifStatement.condition.left.name).toBe('x');
  expect(ifStatement.condition.right.type).toBe('Number');
  expect(ifStatement.condition.right.value).toBe(10);

  const consequent = ifStatement.body[0] as any;
  expect(consequent.type).toBe('Identifier');
  expect(consequent.name).toBe('x');

  const alternate = ifStatement.else[0] as any;
  expect(alternate.type).toBe('Number');
  expect(alternate.value).toBe(0);
});

test('should parse conditional statements without else blocks', () => {
  const program = `
  if (x > 10) {
    x
  }
  `;

  const lexer = new Lexer();
  const tokens = lexer.tokenize(program);
  const parser = new Parser();
  const ast = parser.parse(tokens);

  expect(ast.type).toBe('Program');
  expect(ast.body.length).toBe(1);

  const ifStatement = ast.body[0] as any;

  expect(ifStatement.type).toBe('IfStatement');
  expect(ifStatement.condition.type).toBe('BinaryExpression');
  expect(ifStatement.condition.operator.value).toBe('>');
  expect(ifStatement.condition.left.type).toBe('Identifier');
  expect(ifStatement.condition.left.name).toBe('x');
  expect(ifStatement.condition.right.type).toBe('Number');
  expect(ifStatement.condition.right.value).toBe(10);
});

test('should parse while loops', () => {
  const program = `
  while (x < 10) {
    x
  }
  `;
  const lexer = new Lexer();
  const tokens = lexer.tokenize(program);
  const parser = new Parser();
  const ast = parser.parse(tokens);

  expect(ast.type).toBe('Program');
  expect(ast.body.length).toBe(1);

  const whileStatement = ast.body[0] as any;

  expect(whileStatement.type).toBe('WhileStatement');
  expect(whileStatement.condition.type).toBe('BinaryExpression');
  expect(whileStatement.condition.operator.value).toBe('<');
  expect(whileStatement.condition.left.type).toBe('Identifier');
  expect(whileStatement.condition.left.name).toBe('x');
  expect(whileStatement.condition.right.type).toBe('Number');
  expect(whileStatement.condition.right.value).toBe(10);

  const body = whileStatement.body[0] as any;
  expect(body.type).toBe('Identifier');
  expect(body.name).toBe('x');
});

test('should parse function calls', () => {
  const program = `
  add(1, 2)
  `;

  const lexer = new Lexer();
  const tokens = lexer.tokenize(program);
  const parser = new Parser();
  const ast = parser.parse(tokens);

  expect(ast.type).toBe('Program');
  expect(ast.body.length).toBe(1);

  const funcCall = ast.body[0] as any;

  expect(funcCall.type).toBe('FunctionCall');
  expect(funcCall.name).toBe('add');
  expect(funcCall.arguments.length).toBe(2);

  expect(funcCall.arguments[0].type).toBe('Number');
  expect(funcCall.arguments[0].value).toBe(1);

  expect(funcCall.arguments[1].type).toBe('Number');
  expect(funcCall.arguments[1].value).toBe(2);
});