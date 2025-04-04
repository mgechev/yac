import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { Interpreter } from "./interpreter";

const evaluate = (input: string) => {
  const lexer = new Lexer();
  const tokens = lexer.tokenize(input);
  const parser = new Parser();
  const ast = parser.parse(tokens);
  const interpreter = new Interpreter();
  return interpreter.evaluate(ast);
};

evaluate('log((2 + 2) * 3)'); // 12
evaluate('log(2 + 2 * 3)'); // 8
evaluate('log(2 + 2 * 3 - 1)'); // 7

evaluate(`
function add(a, b) {
  return a + b
}

log(add(2, 3));
`);

evaluate(`
function fibonacci(n) {
  if (n == 0) {
    return 0
  }
  if (n == 1) {
    return 1
  }
  return fibonacci(n - 1) + fibonacci(n - 2)
}

log(fibonacci(10))
`);
  