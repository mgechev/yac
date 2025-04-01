import { Expression, FunctionCallNode, FunctionDeclarationNode, IfStatementNode, NodeType, NumberNode, Program, ReturnStatementNode, Statement, VariableDeclarationNode, WhileStatementNode } from "./parser";
import { Node } from "./parser";

class Scope {
  private variables: { [key: string]: number | boolean } = {};
  private functions: { [key: string]: FunctionDeclarationNode } = {};
  
  returnValue: number | boolean | undefined = undefined;

  setVariable(name: string, value: number | boolean) {
    this.variables[name] = value;
  }

  getVariable(name: string): number | boolean {
    return this.variables[name];
  }

  setFunction(name: string, func: FunctionDeclarationNode) {
    this.functions[name] = func;
  }

  getFunction(name: string): FunctionDeclarationNode {
    return this.functions[name];
  }
  
  hasVariable(name: string): boolean {
    return name in this.variables;
  }

  hasFunction(name: string): boolean {
    return name in this.functions;
  }
}

class GlobalScope extends Scope {
  constructor() {
    super();
    this.setFunction('log', {
      type: NodeType.FunctionDeclaration,
      name: 'log',
      parameters: ['value'],
      body: [],
    });
  }
}

class SymbolTable {
  private namespaces: Scope[] = [new GlobalScope()];

  getCurrentScope() {
    return this.namespaces[this.namespaces.length - 1];
  }

  enterScope() {
    this.namespaces.push(new Scope());
  }

  exitScope() {
    if (this.namespaces.length <= 1) {
      throw new Error('Cannot exit global scope');
    }
    this.namespaces.pop();
  }

  getGlobalScope() {
    return this.namespaces[0];
  }

  getVariable(name: string): number | boolean {
    for (let i = this.namespaces.length - 1; i >= 0; i--) {
      const scope = this.namespaces[i];
      if (scope.hasVariable(name)) {
        return scope.getVariable(name);
      }
    }
    throw new Error(`Unknown variable: ${name}`);
  }

  getFunction(name: string): FunctionDeclarationNode {
    for (let i = this.namespaces.length - 1; i >= 0; i--) {
      const scope = this.namespaces[i];
      if (scope.hasFunction(name)) {
        return scope.getFunction(name);
      }
    }
    throw new Error(`Unknown function: ${name}`);
  }
}

export class Interpreter {
  private symbolTable = new SymbolTable();

  evaluate(node: Node): void {
    switch (node.type) {
      case NodeType.Program:
        this.evaluateProgram(node);
        break;
      case NodeType.BinaryExpression:
        this.evaluateBinaryExpression(node);
        break
      case NodeType.FunctionCall:
        this.evaluateFunctionCall(node);
        break;
      case NodeType.Number:
        this.evaluateNumber(node);
        break;
      case NodeType.FunctionDeclaration:
        this.evaluateFunctionDeclaration(node);
        break;
      case NodeType.IfStatement:
        this.evaluateIfStatement(node);
        break;
      case NodeType.WhileStatement:
        this.evaluateWhileStatement(node);
        break;
      case NodeType.VariableDeclaration:
        this.evaluateVariableDeclaration(node);
        break;
      case NodeType.ReturnStatement:
        this.evaluateReturnStatement(node);
        break;
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }
  
  private evaluateProgram(node: Program) {
    this.evaluateStatements(node.body);
  }

  private evaluateStatements(statements: Statement[]) {
    for (const statement of statements) {
      this.evaluate(statement);
      if (statement.type === NodeType.ReturnStatement) {
        break;
      }
    }
  }

  private evaluateNumber(node: NumberNode) {
    return node.value;
  }

  private evaluateFunctionDeclaration(node: FunctionDeclarationNode) {
    const globalScope = this.symbolTable.getGlobalScope();
    globalScope.setFunction(node.name, node);
  }

  private evaluateIfStatement(node: IfStatementNode) {
    if (this.evaluateBinaryExpression(node.condition)) {
      this.evaluateStatements(node.body);
    } else if (node.else) {
      this.evaluateStatements(node.else);
    }
  }

  private evaluateWhileStatement(node: WhileStatementNode) {
    while (this.evaluateBinaryExpression(node.condition)) {
      this.evaluateStatements(node.body);
    }
  }

  private evaluateVariableDeclaration(node: VariableDeclarationNode) {
    const scope = this.symbolTable.getCurrentScope();
    scope.setVariable(node.name, this.evaluateBinaryExpression(node.value));
  }

  private evaluateFunctionCall(node: FunctionCallNode): number|boolean {
    const func = this.symbolTable.getFunction(node.name);
    this.symbolTable.enterScope();
    for (let i = 0; i < func.parameters.length; i++) {
      this.symbolTable.getCurrentScope().setVariable(func.parameters[i], this.evaluateBinaryExpression(node.arguments[i]));
    }
    this.evaluateStatements(func.body);
    const result = this.symbolTable.getCurrentScope().returnValue;
    if (result === undefined) {
      throw new Error(`Function ${node.name} did not return a value`);
    }
    this.symbolTable.exitScope();
    return result;
  }


  private evaluateReturnStatement(node: ReturnStatementNode) {
    this.symbolTable.getCurrentScope().returnValue = this.evaluateBinaryExpression(node.value);
  }
  
  private evaluateBinaryExpression(node: Expression): number|boolean {
    if (node.type === NodeType.Number) {
      return this.evaluateNumber(node as NumberNode);
    }
    if (node.type === NodeType.FunctionCall) {
      return this.evaluateFunctionCall(node as FunctionCallNode);
    }
    if (node.type === NodeType.Identifier) {
      return this.symbolTable.getVariable(node.name);
    }
    const left = this.evaluateBinaryExpression(node.left);
    const right = this.evaluateBinaryExpression(node.right);
    switch (node.operator.value) {
      case '+':
        return castToNumber(left) + castToNumber(right);
      case '-':
        return castToNumber(left) - castToNumber(right);
      case '*':
        return castToNumber(left) * castToNumber(right);
      case '/':
        return castToNumber(left) / castToNumber(right);
      case '>':
        return left > right
      case '<':
        return left < right;
      case '==':
        return left === right;
      case '!=':
        return left !== right;
      default:
        throw new Error(`Unknown operator: ${node.operator.value}`);
    }
  }
}

const castToNumber = (value: number|boolean) => {
  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }
  return value;
};