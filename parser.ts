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
