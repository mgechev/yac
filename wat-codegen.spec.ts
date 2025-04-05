import { beforeAll, beforeEach, expect, test } from "vitest";
import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { WebAssemblyTextCodegen } from "./wat-codegen";

let lexer: Lexer;
let parser: Parser;
let codegen: WebAssemblyTextCodegen;

beforeEach(() => {
  lexer = new Lexer();
  parser = new Parser();
  codegen = new WebAssemblyTextCodegen();
});

const normalize = (str: string) => str.replace(/\n/g, "");

test("generate empty programs", () => {
  const program = ``;

  const tokens = lexer.tokenize(program);
  const ast = parser.parse(tokens);
  const generatedCode = normalize(codegen.generate(ast));

  expect(generatedCode).toBe("(module)");
});

test("generate simple expressions", () => {
  const program = `1 + 2`;

  const tokens = lexer.tokenize(program);
  const ast = parser.parse(tokens);
  const generatedCode = normalize(codegen.generate(ast));

  expect(generatedCode).toBe("(module(func $main(f32.const 1)(f32.const 2)(f32.add)(drop)(return))(start $main))");
});

test("generate expressions with different operator presentence", () => {
  const program = `1 + 2 * 3`;

  const tokens = lexer.tokenize(program);
  const ast = parser.parse(tokens);
  const generatedCode = normalize(codegen.generate(ast));

  expect(generatedCode).toBe("(module(func $main(f32.const 1)(f32.const 2)(f32.const 3)(f32.mul)(f32.add)(drop)(return))(start $main))");
});

test("generate expressions with parentheses", () => {
  const program = `(1 + 2) * 3`;

  const tokens = lexer.tokenize(program);
  const ast = parser.parse(tokens);
  const generatedCode = normalize(codegen.generate(ast));

  expect(generatedCode).toBe("(module(func $main(f32.const 1)(f32.const 2)(f32.add)(f32.const 3)(f32.mul)(drop)(return))(start $main))");
});

test("generate expressions with nested parentheses", () => {
  const program = `((1 + 2) * 3) + 4`;

  const tokens = lexer.tokenize(program);
  const ast = parser.parse(tokens);
  const generatedCode = normalize(codegen.generate(ast));

  expect(generatedCode).toBe("(module(func $main(f32.const 1)(f32.const 2)(f32.add)(f32.const 3)(f32.mul)(f32.const 4)(f32.add)(drop)(return))(start $main))");
});

test("generate simple function declaration and call", () => {
  const program = `
    function add(a, b) {
      return a + b
    }
    add(1, 2)
  `;

  const tokens = lexer.tokenize(program);
  const ast = parser.parse(tokens);
  const generatedCode = normalize(codegen.generate(ast));

  expect(generatedCode).toBe("(module(func $add (param $a f32) (param $b f32) (result f32)(local.get $a)(local.get $b)(f32.add)(return))(func $main(f32.const 1)(f32.const 2)(call $add)(drop)(return))(start $main))");
});

test("generate simple function declaration and calls between them", () => {
  const program = `
    function add(a, b) {
      return a + b
    }

    function addOne(a) {
      return add(a, 1)
    }

    addOne(1, 2)
  `;

  const tokens = lexer.tokenize(program);
  const ast = parser.parse(tokens);
  const generatedCode = normalize(codegen.generate(ast));

  expect(generatedCode).toBe("(module(func $add (param $a f32) (param $b f32) (result f32)(local.get $a)(local.get $b)(f32.add)(return))(func $addOne (param $a f32) (result f32)(local.get $a)(f32.const 1)(call $add)(return))(func $main(f32.const 1)(f32.const 2)(call $addOne)(drop)(return))(start $main))");
});

test('should work with conditional statements', () => {
  const program = `
    function getBigger(a, b) {
      if (a > b) {
        return a
      } else {
        return b
      }
    }

    getBigger(1, 2)
  `;

  const tokens = lexer.tokenize(program);
  const ast = parser.parse(tokens);
  const generatedCode = normalize(codegen.generate(ast));

  expect(generatedCode).toBe("(module(func $getBigger (param $a f32) (param $b f32) (result f32)(local.get $a)(local.get $b)(f32.gt)(if (result f32)(then(local.get $a)(return))(else(local.get $b)(return))))(func $main(f32.const 1)(f32.const 2)(call $getBigger)(drop)(return))(start $main))");
});

test('should work with recursive functions', () => {
  const program = `
    function fibonacci(n) {
      if (n == 0) {
        return 0
      }
      if (n == 1) {
        return 1
      }
      return fibonacci(n - 1) + fibonacci(n - 2)
    }

    fibonacci(10)
  `;

  const tokens = lexer.tokenize(program);
  const ast = parser.parse(tokens);
  const generatedCode = normalize(codegen.generate(ast));

  expect(generatedCode).toBe("(module(func $fibonacci (param $n f32) (result f32)(local.get $n)(f32.const 0)(f32.eq)(if(then(f32.const 0)(return)))(local.get $n)(f32.const 1)(f32.eq)(if(then(f32.const 1)(return)))(local.get $n)(f32.const 1)(f32.sub)(call $fibonacci)(local.get $n)(f32.const 2)(f32.sub)(call $fibonacci)(f32.add)(return))(func $main(f32.const 10)(call $fibonacci)(drop)(return))(start $main))");
});
