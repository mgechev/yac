export enum TokenType {
  Number,
  Operator,
  Parenthesis,
  Keyword,
  Identifier,
  Brace
}

export interface Token {
  type: TokenType;
  value: string;
  start: number;
}

const keywords = new Set(['let', 'if', 'else', 'while', 'function', 'return']);

export class Lexer {
  private current = 0;

  tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    while (this.current < input.length) {
      const char = input[this.current];
      if (/\s/.test(char)) {
        this.current++;
        continue;
      } else if (char === '(' || char === ')') {
        tokens.push({ start: this.current, type: TokenType.Parenthesis, value: char });
      } else if (char === '{' || char === '}') {
        tokens.push({ start: this.current, type: TokenType.Brace, value: char });
      } else if (/\d/.test(char)) {
        tokens.push(this.consumeNumber(input));
        continue;
      } else if (/\+|\-|\*|\/|=|,|>|<|!/.test(char)) {
        tokens.push(this.consumeOperator(input));
      } else if (/[a-zA-Z]/.test(char)) {
        tokens.push(this.consumeKeywordOrIdentifier(input));
        continue;
      }
      this.current++;
    }
    return tokens;
  }

  consumeKeywordOrIdentifier(input: string): Token {
    let value = '';
    const start = this.current;
    while (/[a-zA-Z]/.test(input[this.current])) {
      value += input[this.current];
      this.current++;
    }
    if (keywords.has(value)) {
      return { start, type: TokenType.Keyword, value };
    }
    return { start, type: TokenType.Identifier, value };
  }

  consumeNumber(input: string): Token {
    let value = '';
    let decimalPoint = false;
    const start = this.current;
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
    return { start, type: TokenType.Number, value };
  }

  consumeOperator(input: string): Token {
    const char = input[this.current];
    if (char === '=' && input[this.current + 1] === '=') {
      const token = { start: this.current, type: TokenType.Operator, value: '==' };
      this.current++;
      return token;
    } else if (char === '!' && input[this.current + 1] === '=') {
      const token = { start: this.current, type: TokenType.Operator, value: '!=' };
      this.current++;
      return token;
    } else {
      return { start: this.current, type: TokenType.Operator, value: char };
    }
  }
}