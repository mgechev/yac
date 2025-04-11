# Yet Another Compiler

It's always fun to build compilers, so I created another one!

In this project you can find:

- Lexer that produces tokens out of a string
- Parser that does syntactical analysis and produces an abstract syntax tree
- Interpreter that takes the abstract syntax tree, traverses it and interprets it
- Code generator that produces WebAssembly in text format (i.e. `*.wat`)

## How to use?

```bash
git clone git@github.com:mgechev/yac
cd yac && npm i
npm start
```

You can open `index.ts` to edit the source program.

## What does the language support?

This programming language is turing complete! You have loops, conditional statements, variables with symbol tables (functional lexical scope, similar to JavaScript), function declarations, recursion, built in `log` function. All the good stuff.

There are no other constructs and data structures you're probably used to, such as strings, arrays, etc.

Why not? Because they were not fun to implement - they are mostly straightforward and I didn't feel like dealing with them.

If you're interested in learning more about compilers, you can clone this project and implement:

- Strings and arrays as I mentioned above
- File imports so you can write programs spanning across multiple files
- Interop with other languages, so you can call code written in C++ or Java
- Type checking. Here's a good (saying humbly) [article](https://blog.mgechev.com/2017/08/05/typed-lambda-calculus-create-type-checker-transpiler-compiler-javascript/) I wrote sometimes back
- Better error reporting. Currently, I'm capturing the position in the program string where we see a particular token, but not doing much with it
- Language service! Why not create vscode support for this language!

## Example

Here's a program that works as expected:

```
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
```

## License

MIT
