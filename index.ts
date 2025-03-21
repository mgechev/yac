import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { Interpreter } from "./interpreter";

const lexer = new Lexer();
const tokens = lexer.tokenize("1 + 2 * 3.14 / 2");
console.log(tokens);

const parser = new Parser();
const ast = parser.parse(tokens);
console.log(ast);

const interpreter = new Interpreter();
const result = interpreter.evaluate(ast);
console.log(result);
