import { Token, TokenType } from "./lexer";

export enum NodeType {
  BinaryExpression,
  Number
}

export interface Node {
  type: NodeType;
}

export interface BinaryExpressionNode extends Node {
  type: NodeType.BinaryExpression;
  operator: Token;
  left: Node;
  right: Node;
}

export interface NumberNode extends Node {
  type: NodeType.Number;
  value: number;
}

export class Parser {
  parse(tokens: Token[]): Node {
    return this.parseAddition(tokens);
  }

  private parseDivision(tokens: Token[]): BinaryExpressionNode|Node {
    let node: Node|BinaryExpressionNode = this.parseMultiplication(tokens);
    while (tokens.length > 0 && tokens[0].value === '/') {
      const operator = tokens.shift()!;
      const right = this.parseMultiplication(tokens);
      node = { type: NodeType.BinaryExpression, operator, left: node, right };
    }
    return node;
  }

  private parseMultiplication(tokens: Token[]): BinaryExpressionNode|Node {
    let node: Node|BinaryExpressionNode = this.parseNumber(tokens);
    while (tokens.length > 0 && tokens[0].value === '*') {
      const operator = tokens.shift()!;
      const right = this.parseNumber(tokens);
      node = { type: NodeType.BinaryExpression, operator, left: node, right };
    }
    return node;
  }

  private parseAddition(tokens: Token[]): BinaryExpressionNode|Node {
    let node = this.parseDivision(tokens);
    while (tokens.length > 0 && (tokens[0].value === '+' || tokens[0].value === '-')) {
      const operator = tokens.shift()!;
      const right = this.parseDivision(tokens);
      node = { type: NodeType.BinaryExpression, operator, left: node, right };
    }
    return node;
  }

  private parseNumber(tokens: Token[]): NumberNode {
    const token = tokens.shift()!;
    if (token.type !== TokenType.Number) {
      throw new Error('Invalid syntax');
    }
    return { type: NodeType.Number, value: parseFloat(token.value) };
  }
}
