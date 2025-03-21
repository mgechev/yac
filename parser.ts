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
