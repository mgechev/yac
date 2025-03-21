import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { Interpreter } from "./interpreter";

const calculate = (input: string) => {
  const lexer = new Lexer();
  const tokens = lexer.tokenize(input);
  const parser = new Parser();
  const ast = parser.parse(tokens);
  const interpreter = new Interpreter();
  return interpreter.evaluate(ast);
};

console.log(calculate('(2 + 2) * 3')); // 12
console.log(calculate('2 + 2 * 3')); // 8
console.log(calculate('2 + 2 * 3 - 1')); // 7

