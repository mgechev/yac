export enum TokenType {
  Number,
  Operator,
  Paranthesis
}

export interface Token {
  type: TokenType;
  value: string;
}

export class Lexer {
  private current = 0;

  tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    while (this.current < input.length) {
      const char = input[this.current];
      if (char === '(' || char === ')') {
        tokens.push({ type: TokenType.Paranthesis, value: char });
      } else if (/\d/.test(char)) {
        let value = '';
        let decimalPoint = false;
        while (/\d/.test(input[this.current]) || input[this.current] === '.') {
          if (decimalPoint && input[this.current] === '.') {
            throw new Error('Invalid number');
          }
          if (input[this.current] === '.') {
            decimalPoint = true;
          }
          value += input[this.current];
          this.current++;
        }
        tokens.push({ type: TokenType.Number, value });
        continue;
      } else if (/\+|\-|\*|\//.test(char)) {
        tokens.push({ type: TokenType.Operator, value: char });
      }
      this.current++;
    }
    return tokens;
  }
}