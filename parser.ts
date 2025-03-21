import { Token, TokenType } from "./lexer";

export enum NodeType {
  BinaryExpression = "BinaryExpression",
  FunctionCall = "FunctionCall",
  Number = "Number",
  IfStatement = "IfStatement",
  WhileStatement = "WhileStatement",
  FunctionDeclaration = "FunctionDeclaration",
  ReturnStatement = "ReturnStatement",
  VariableDeclaration = "VariableDeclaration",
  Program = "Program",
  Identifier = "Identifier",
}

interface Node {
  type: NodeType;
}

export type Expression =
  | BinaryExpressionNode
  | NumberNode
  | FunctionCallNode
  | IdentifierNode;

export interface IdentifierNode extends Node {
  type: NodeType.Identifier;
  name: string;
}

export type Statement =
  | IfStatementNode
  | WhileStatementNode
  | FunctionDeclarationNode
  | VariableDeclarationNode
  | ReturnStatementNode
  | Expression;

export interface IfStatementNode extends Node {
  type: NodeType.IfStatement;
  condition: Expression;
  body: Statement[];
  else?: Statement[];
}

export interface WhileStatementNode extends Node {
  type: NodeType.WhileStatement;
  condition: Expression;
  body: Node;
}

export interface FunctionDeclarationNode extends Node {
  type: NodeType.FunctionDeclaration;
  name: string;
  parameters: string[];
  body: Statement[];
}

export interface VariableDeclarationNode extends Node {
  type: NodeType.VariableDeclaration;
  name: string;
  value: Expression;
}

export interface ReturnStatementNode extends Node {
  type: NodeType.ReturnStatement;
  value: Expression;
}

export interface FunctionCallNode extends Node {
  type: NodeType.FunctionCall;
  name: string;
  arguments: Expression[];
}

export interface BinaryExpressionNode extends Node {
  type: NodeType.BinaryExpression;
  operator: Token;
  left: Expression;
  right: Expression;
}

export interface NumberNode extends Node {
  type: NodeType.Number;
  value: number;
}

export interface Program {
  type: NodeType.Program;
  body: Statement[];
}

/*

    (2 + 2) * 3

        *
       / \
      +   3
    /  \
   2    2


   2 + 2 * 3

      +
    /  \
   2    *
       / \
      2   3

*/

export class Parser {
  parse(tokens: Token[]): Program {
    return this.parseProgram(tokens);
  }

  private parseProgram(tokens: Token[]): Program {
    return { type: NodeType.Program, body: this.parseStatements(tokens) };
  }

  private parseStatements(tokens: Token[]): Statement[] {
    const statements: Statement[] = [];
    while (tokens.length > 0) {
      statements.push(this.parseStatement(tokens));
    }
    return statements;
  }

  private parseStatement(tokens: Token[]): Statement {
    const token = tokens[0];
    if (token.type === TokenType.Keyword && token.value === "let") {
      return this.parseVariableDeclaration(tokens);
    } else if (token.type === TokenType.Keyword && token.value === "if") {
      return this.parseIfStatement(tokens);
    } else if (token.type === TokenType.Keyword && token.value === "while") {
      return this.parseWhileStatement(tokens);
    } else if (token.type === TokenType.Keyword && token.value === "function") {
      return this.parseFunctionDeclaration(tokens);
    } else if (token.type === TokenType.Keyword && token.value === "return") {
      return this.parseReturnStatement(tokens);
    } else if (isExpressionPrefix(tokens)) {
      return this.parseExpression(tokens);
    } else {
      throw new Error(`Unexpected token: ${token.value}`);
    }
  }

  private parseReturnStatement(tokens: Token[]): ReturnStatementNode {
    tokens.shift();
    const value = this.parseExpression(tokens);
    return { type: NodeType.ReturnStatement, value };
  }

  private parseFunctionDeclaration(tokens: Token[]): FunctionDeclarationNode {
    tokens.shift();
    const name = tokens.shift()!.value;
    if (tokens.shift()!.value !== "(") {
      throw new Error("Expected opening parenthesis");
    }
    const parameters: string[] = [];
    while (tokens[0].value !== ")") {
      parameters.push(tokens.shift()!.value);
      if (tokens[0].value === ",") {
        tokens.shift();
      }
    }
    tokens.shift();
    if (tokens.shift()!.value !== "{") {
      throw new Error("Expected opening brace");
    }
    const body: Statement[] = [];
    while ((tokens[0] as any).value !== "}") {
      const statement = this.parseStatement(tokens);
      body.push(statement);
    }
    tokens.shift();
    return { type: NodeType.FunctionDeclaration, name, parameters, body };
  }

  private parseWhileStatement(tokens: Token[]): WhileStatementNode {
    tokens.shift();
    const condition = this.parseExpression(tokens);
    if (tokens.shift()!.value !== "{") {
      throw new Error("Expected opening brace");
    }
    const body = this.parseStatements(tokens)[0];
    return { type: NodeType.WhileStatement, condition, body };
  }

  private parseIfStatement(tokens: Token[]): IfStatementNode {
    // 'if' token
    tokens.shift();
    // '(' token
    tokens.shift();
    const condition = this.parseExpression(tokens);
    // ')' token
    tokens.shift();
    if (tokens.shift()!.value !== "{") {
      throw new Error("Expected opening brace");
    }
    const body: Statement[] = [];
    while ((tokens[0] as any).value !== "}") {
      const statement = this.parseStatement(tokens);
      body.push(statement);
    }
    // '}' token
    tokens.shift();
    let elseBody: Statement[]|undefined = undefined;
    if (tokens.length && tokens[0].value === "else") {
      tokens.shift();
      if (tokens.shift()!.value !== "{") {
        throw new Error("Expected opening brace");
      }
      elseBody = [];
      while ((tokens[0] as any).value !== "}") {
        const statement = this.parseStatement(tokens);
        elseBody.push(statement);
      }
      tokens.shift();
    }
    return { type: NodeType.IfStatement, condition, body, else: elseBody };
  }

  private parseVariableDeclaration(tokens: Token[]): VariableDeclarationNode {
    tokens.shift();
    const name = tokens.shift()!.value;
    if (tokens.shift()!.value !== "=") {
      throw new Error("Expected assignment operator");
    }
    const value = this.parseExpression(tokens);
    return { type: NodeType.VariableDeclaration, name, value };
  }

  private parseExpression(tokens: Token[]): Expression {
    return this.parseAddition(tokens);
  }

  private parseAddition(tokens: Token[]): Expression {
    let node = this.parseMultiplication(tokens);
    while (
      isExpressionPrefix(tokens) &&
      (tokens[0].value === "+" || tokens[0].value === "-")
    ) {
      const operator = tokens.shift()!;
      const right = this.parseMultiplication(tokens);
      node = { type: NodeType.BinaryExpression, operator, left: node, right };
    }
    return node;
  }

  private parseMultiplication(tokens: Token[]): Expression {
    let node: Expression = this.parseBooleanExpression(tokens);
    while (
      isExpressionPrefix(tokens) &&
      (tokens[0].value === "*" || tokens[0].value === "/")
    ) {
      const operator = tokens.shift()!;
      const right = this.parseBooleanExpression(tokens);
      node = { type: NodeType.BinaryExpression, operator, left: node, right };
    }
    return node;
  }

  private parseBooleanExpression(tokens: Token[]): Expression {
    let node = this.parseTerm(tokens);
    while (
      isExpressionPrefix(tokens) &&
      (tokens[0].value === ">" ||
        tokens[0].value === "<" ||
        tokens[0].value === "==" ||
        tokens[0].value === "!=")
    ) {
      const operator = tokens.shift()!;
      const right = this.parseTerm(tokens);
      node = { type: NodeType.BinaryExpression, operator, left: node, right };
    }
    return node;
  }

  private parseTerm(tokens: Token[]): Expression {
    const token = tokens.shift()!;
    if (token.type === TokenType.Parenthesis && token.value === "(") {
      const node = this.parseAddition(tokens);
      if (tokens.shift()!.value !== ")") {
        throw new Error("Expected closing parenthesis");
      }
      return node;
    }
    if (token.type === TokenType.Identifier) {
      return { type: NodeType.Identifier, name: token.value };
    }
    return { type: NodeType.Number, value: parseFloat(token.value) };
  }
}

const expressionTokens = new Set([
  TokenType.Number,
  TokenType.Identifier,
  TokenType.Parenthesis,
  TokenType.Operator,
]);

const isExpressionPrefix = (tokens: Token[]) => {
  if (tokens.length === 0) {
    return false;
  }

  const next = tokens[0];
  return expressionTokens.has(next.type);
};
