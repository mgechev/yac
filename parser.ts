import { Token, TokenType } from "./lexer";

export enum NodeType {
  BinaryExpression,
  FunctionCall,
  Number,
  IfStatement,
  WhileStatement,
  FunctionDeclaration,
  ReturnStatement,
  VariableDeclaration,
  Program
}

interface Node {
  type: NodeType;
}

export type Statement = IfStatementNode | WhileStatementNode | FunctionDeclarationNode | VariableDeclarationNode | ReturnStatementNode;
export type Expression = BinaryExpressionNode | NumberNode | FunctionCallNode;

export interface IfStatementNode extends Node {
  type: NodeType.IfStatement;
  condition: Expression;
  body: Node;
  else?: Node;
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
  parse(tokens: Token[]): Node {
    return this.parseProgram(tokens);
  }

  private parseProgram(tokens: Token[]): Program {
    return { type: NodeType.Program, body: this.parseStatements(tokens) };
  }

  private parseStatements(tokens: Token[]): Statement[] {
    const statements: Statement[] = [];
    while (tokens.length > 0) {
      const token = tokens[0];
      if (token.type === TokenType.Keyword && token.value === 'let') {
        statements.push(this.parseVariableDeclaration(tokens));
      } else if (token.type === TokenType.Keyword && token.value === 'if') {
        statements.push(this.parseIfStatement(tokens));
      } else if (token.type === TokenType.Keyword && token.value === 'while') {
        statements.push(this.parseWhileStatement(tokens));
      } else if (token.type === TokenType.Keyword && token.value === 'function') {
        statements.push(this.parseFunctionDeclaration(tokens));
      } else if (token.type === TokenType.Keyword && token.value === 'return') {
        statements.push(this.parseReturnStatement(tokens));
      } else {
        throw new Error('Invalid token');
      }
    }
    return statements;
  }

  private parseReturnStatement(tokens: Token[]): ReturnStatementNode {
    tokens.shift();
    const value = this.parseExpression(tokens);
    return { type: NodeType.ReturnStatement, value };
  }

  private parseFunctionDeclaration(tokens: Token[]): FunctionDeclarationNode {
    tokens.shift();
    const name = tokens.shift()!.value;
    if (tokens.shift()!.value !== '(') {
      throw new Error('Expected opening paranthesis');
    }
    const parameters: string[] = [];
    while (tokens[0].value !== ')') {
      parameters.push(tokens.shift()!.value);
      if (tokens[0].value === ',') {
        tokens.shift();
      }
    }
    tokens.shift();
    if (tokens.shift()!.value !== '{') {
      throw new Error('Expected opening brace');
    }
    const body: Statement[] = [];
    while (tokens[0].value !== '}') {
      body.push(this.parseStatements(tokens)[0]);
    }
    tokens.shift();
    return { type: NodeType.FunctionDeclaration, name, parameters, body };
  }

  private parseWhileStatement(tokens: Token[]): WhileStatementNode {
    tokens.shift();
    const condition = this.parseExpression(tokens);
    if (tokens.shift()!.value !== '{') {
      throw new Error('Expected opening brace');
    }
    const body = this.parseStatements(tokens)[0];
    return { type: NodeType.WhileStatement, condition, body };
  }

  private parseIfStatement(tokens: Token[]): IfStatementNode {
    tokens.shift();
    const condition = this.parseExpression(tokens);
    if (tokens.shift()!.value !== '{') {
      throw new Error('Expected opening brace');
    }
    const body = this.parseStatements(tokens)[0];
    let elseBody;
    if (tokens[0].value === 'else') {
      tokens.shift();
      if (tokens.shift()!.value !== '{') {
        throw new Error('Expected opening brace');
      }
      elseBody = this.parseStatements(tokens)[0];
    }
    return { type: NodeType.IfStatement, condition, body, else: elseBody };
  }

  private parseVariableDeclaration(tokens: Token[]): VariableDeclarationNode {
    tokens.shift();
    const name = tokens.shift()!.value;
    if (tokens.shift()!.value !== '=') {
      throw new Error('Expected assignment operator');
    }
    const value = this.parseExpression(tokens);
    return { type: NodeType.VariableDeclaration, name, value };
  }

  private parseExpression(tokens: Token[]): Expression {
    return this.parseAddition(tokens);
  }

  private parseAddition(tokens: Token[]): BinaryExpressionNode|Node {
    let node = this.parseMultiplication(tokens);
    while (tokens.length > 0 && (tokens[0].value === '+' || tokens[0].value === '-')) {
      const operator = tokens.shift()!;
      const right = this.parseMultiplication(tokens);
      node = { type: NodeType.BinaryExpression, operator, left: node, right };
    }
    return node;
  }

  private parseMultiplication(tokens: Token[]): BinaryExpressionNode|Node {
    let node: Node|BinaryExpressionNode = this.parseNumber(tokens);
    while (tokens.length > 0 && (tokens[0].value === '*' || tokens[0].value === '/')) {
      const operator = tokens.shift()!;
      const right = this.parseNumber(tokens);
      node = { type: NodeType.BinaryExpression, operator, left: node, right };
    }
    return node;
  }

  private parseNumber(tokens: Token[]): Node|NumberNode {
    const token = tokens.shift()!;
    if (token.type === TokenType.Paranthesis && token.value === '(') {
      const node = this.parseAddition(tokens);
      if (tokens.shift()!.value !== ')') {
        throw new Error('Expected closing paranthesis');
      }
      return node;
    }
    if (token.type !== TokenType.Number) {
      throw new Error('Invalid token');
    }
    return { type: NodeType.Number, value: parseFloat(token.value) };
  }
}
