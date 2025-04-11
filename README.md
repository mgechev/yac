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

## License

MIT
