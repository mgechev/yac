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

  expect(generatedCode).toBe("(module(func $main(f32.const 1)(f32.const 2)(f32.add)return)(start $main))");
});

test("generate expressions with different operator presentence", () => {
  const program = `1 + 2 * 3`;

  const tokens = lexer.tokenize(program);
  const ast = parser.parse(tokens);
  const generatedCode = normalize(codegen.generate(ast));

  expect(generatedCode).toBe("(module(func $main(f32.const 1)(f32.const 2)(f32.const 3)(f32.mul)(f32.add)return)(start $main))");
});

test("generate expressions with parentheses", () => {
  const program = `(1 + 2) * 3`;

  const tokens = lexer.tokenize(program);
  const ast = parser.parse(tokens);
  const generatedCode = normalize(codegen.generate(ast));

  expect(generatedCode).toBe("(module(func $main(f32.const 1)(f32.const 2)(f32.add)(f32.const 3)(f32.mul)return)(start $main))");
});

test("generate expressions with nested parentheses", () => {
  const program = `((1 + 2) * 3) + 4`;

  const tokens = lexer.tokenize(program);
  const ast = parser.parse(tokens);
  const generatedCode = normalize(codegen.generate(ast));

  expect(generatedCode).toBe("(module(func $main(f32.const 1)(f32.const 2)(f32.add)(f32.const 3)(f32.mul)(f32.const 4)(f32.add)return)(start $main))");
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

  expect(generatedCode).toBe("(module(func $add (param $a f32) (param $b f32) (local.get $a)(local.get $b)(f32.add)(return))(func $main(f32.const 1)(f32.const 2)(call $add)return)(start $main))");
});