import {
  BinaryExpressionNode,
  BuiltInFunctionCallNode,
  FunctionCallNode,
  FunctionDeclarationNode,
  IdentifierNode,
  IfStatementNode,
  Node,
  NumberNode,
  Program,
  ReturnStatementNode,
  Statement,
  VariableDeclarationNode,
  WhileStatementNode,
} from "./parser";

export class WebAssemblyTextCodegen {
  generate(node: Node): string {
    switch (node.type) {
      case "Program":
        return this.generateProgram(node);
      case "FunctionDeclaration":
        return this.generateFunction(node);
      case "ReturnStatement":
        return this.generateReturnStatement(node);
      case "BinaryExpression":
        return this.generateBinaryExpression(node);
      case "IfStatement":
        return this.generateIfStatement(node);
      case "VariableDeclaration":
        return this.generateVariableDeclaration(node);
      case "Identifier":
        return this.generateIdentifier(node);
      case "Number":
        return this.generateNumber(node);
      case "FunctionCall":
        return this.generateFunctionCall(node);
      case "WhileStatement":
        return this.generateWhileStatement(node);
      case "BuiltInFunction":
        return this.generateBuiltInFunction(node);
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  private generateProgram(node: Program): string {
    let code = "(module\n";

    const functionDeclarations = node.body.filter(
      (statement) => statement.type === "FunctionDeclaration"
    ) as FunctionDeclarationNode[];
    for (const functionDeclaration of functionDeclarations) {
      code += this.generateFunction(functionDeclaration);
    }

    const nonFunctionDeclarations = node.body.filter(
      (statement) => statement.type !== "FunctionDeclaration"
    ) as Statement[];

    if (nonFunctionDeclarations.length === 0) {
      return code + ')\n';
    }

    code += `\n(func $main\n`;
    for (const nonFunctionDeclaration of nonFunctionDeclarations) {
      code += this.generate(nonFunctionDeclaration);
    }

    code += "return)\n";
    code += "(start $main))\n";

    return code;
  }

  private generateFunction(node: FunctionDeclarationNode): string {
    let code = `(func $${node.name} `;
    for (const param of node.parameters) {
      code += `(param $${param} f32) `;
    }
    code += "\n";
    for (const statement of node.body) {
      code += this.generate(statement);
    }
    code += ")\n";
    return code;
  }

  private generateReturnStatement(node: ReturnStatementNode): string {
    let code = '';
    if (node.value) {
      code += this.generate(node.value);
    }
    code += "(return)\n"
    return code;
  }

  private generateBinaryExpression(node: BinaryExpressionNode): string {
    let code = "";
    code += this.generate(node.left);
    code += this.generate(node.right);
    switch (node.operator.value) {
      case "+":
        code += "(f32.add)\n";
        break;
      case "-":
        code += "(f32.sub)\n";
        break;
      case "*":
        code += "(f32.mul)\n";
        break;
      case "/":
        code += "(f32.div)\n";
        break;
      case ">":
        code += "(f32.gt)\n";
        break;
      case "<":
        code += "(f32.lt)\n";
        break;
      case "==":
        code += "(f32.eq)\n";
        break;
      case "!=":
        code += "(f32.ne)\n";
        break;
      default:
        throw new Error(`Unknown operator: ${node.operator}`);
    }
    return code;
  }

  private generateIfStatement(node: IfStatementNode): string {
    let code = "(if (result f32)\n";
    code += this.generate(node.condition);
    code += "(then\n";
    for (const statement of node.body) {
      code += this.generate(statement);
    }
    code += ")\n";
    if (node.else) {
      code += "(else\n";
      for (const statement of node.else) {
        code += this.generate(statement);
      }
      code += ")\n";
    }
    code += ")\n";
    return code;
  }

  private generateVariableDeclaration(node: VariableDeclarationNode): string {
    let code = `(local $${node.name} f32) `;
    code += `${this.generate(node.value)}\n`;
    code += `(local.set $${node.name})\n`;
    return code;
  }

  private generateIdentifier(node: IdentifierNode): string {
    return `(local.get $${node.name})\n`;
  }

  private generateNumber(node: NumberNode): string {
    return `(f32.const ${node.value})\n`;
  }

  private generateFunctionCall(node: FunctionCallNode): string {
    let code = '';
    for (const arg of node.arguments) {
      code += this.generate(arg);
    }
    code = `(call $${node.name})\n`;
    return code;
  }

  private generateWhileStatement(node: WhileStatementNode): string {
    let code = "(loop $loop\n";
    code += this.generate(node.condition);
    code += "(if (result i32)\n";
    for (const statement of node.body) {
      code += this.generate(statement);
    }
    code += ")\n";
    code += "(br $loop)\n";
    code += ")\n";
    return code;
  }

  private generateBuiltInFunction(node: BuiltInFunctionCallNode): string {
    switch (node.name) {
      case "log":
        return `(call $log ___)\n`;
      default:
        throw new Error(`Unknown built-in function: ${node.name}`);
    }
  }
}
