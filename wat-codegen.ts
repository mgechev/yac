import {
  AssignmentNode,
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

const ConsoleLogImport = '(import "console" "log" (func $log (param f32) (result f32)))';

export class WebAssemblyTextCodegen {
  private loopCounter = 0;
  private builtInFunctions: {[name: string]: string} = {
    'log': '$log'
  };

  generate(node: Node): string {
    const imports = this.getImportList(node);
    return this.generateFromNode(node, imports);
  }

  private getImportList(node: Node): string[] {
    const imports = new Set<string>();
    const traverse = (node: Node|Node[]) => {
      if (Array.isArray(node)) {
        for (const n of node) {
          traverse(n);
        }
        return;
      }
      switch (node.type) {
        case 'Program':
          traverse(node.body);
          break;
        case 'FunctionCall':
          if (node.name === 'log') {
            imports.add(ConsoleLogImport);
          }
          traverse(node.arguments);
          break;
        case 'FunctionDeclaration':
          for (const statement of node.body) {
            traverse(statement);
          }
          break;
        case 'IfStatement':
          traverse(node.condition);
          traverse(node.body);
          if (node.else) {
            traverse(node.body);
          }
          break;
        case 'WhileStatement':
          traverse(node.condition);
          traverse(node.body);
          break;
        case 'VariableDeclaration':
          traverse(node.value);
          break;
        case 'Assignment':
          traverse(node.value);
          break;
        default:
          break;
        };
    };
    traverse(node)
    return Array.from(imports);
  }

  private generateFromNode(node: Node, imports?: string[]): string {
    switch (node.type) {
      case "Program":
        return this.generateProgram(node, imports ?? []);
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
      case "Assignment":
        return this.generateVariableAssignment(node);
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  private generateProgram(node: Program, imports: string[]): string {
    let code = "(module\n";

    code += imports.join(' ') + '\n';

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
      code += this.generateFromNode(nonFunctionDeclaration);
    }

    code += "(drop)\n(return))\n";
    code += "(start $main))\n";

    return code;
  }

  private generateFunction(node: FunctionDeclarationNode): string {
    let code = `(func $${node.name} `;
    for (const param of node.parameters) {
      code += `(param $${param} f32) `;
    }
    code += (`(result f32)\n`);
    const hasTailReturn = node.body[node.body.length - 1].type === "ReturnStatement";
    for (const statement of node.body) {
      if (statement.type === "IfStatement") {
        code += this.generateIfStatement(statement, hasTailReturn);
        continue;
      }
      code += this.generateFromNode(statement);
    }
    code += ")\n";
    return code;
  }

  private generateReturnStatement(node: ReturnStatementNode): string {
    let code = '';
    if (node.value) {
      code += this.generateFromNode(node.value);
    }
    code += "(return)\n"
    return code;
  }

  private generateBinaryExpression(node: BinaryExpressionNode): string {
    let code = "";
    code += this.generateFromNode(node.left);
    code += this.generateFromNode(node.right);
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

  private generateIfStatement(node: IfStatementNode, hasTailReturn = false): string {
    let code = "";
    code += this.generateFromNode(node.condition);
    if (hasTailReturn) {
      code += "(if\n";
    } else {
      code += "(if (result f32)\n";
    }
    code += "(then\n";
    for (const statement of node.body) {
      code += this.generateFromNode(statement);
    }
    code += ")\n";
    if (node.else) {
      code += "(else\n";
      for (const statement of node.else) {
        code += this.generateFromNode(statement);
      }
      code += ")\n";
    }
    code += ")\n";
    return code;
  }

  private generateVariableDeclaration(node: VariableDeclarationNode): string {
    let code = `(local $${node.name} f32) `;
    code += `${this.generateFromNode(node.value)}\n`;
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
      code += this.generateFromNode(arg);
    }
    let name = node.name;
    if (this.builtInFunctions[name]) {
      name = this.builtInFunctions[name];
    }
    code += `(call $${node.name})\n`;
    return code;
  }

  private generateVariableAssignment(node: AssignmentNode): string {
    let code = this.generateFromNode(node.value);
    code += `(local.set $${node.variable})\n`;
    return code;
  }

  private generateWhileStatement(node: WhileStatementNode): string {
    const loopName = `$loop_${this.loopCounter++}`;
    let code = `(loop ${loopName}\n`;
    code += this.generateFromNode(node.condition);
    code += `br_if ${loopName}`;
    for (const statement of node.body) {
      code += this.generateFromNode(statement);
    }
    return `${code}\n)`;
    
  }
}
