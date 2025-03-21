import { BinaryExpressionNode, Node, NodeType, NumberNode } from "./parser";

export class Interpreter {
  evaluate(node: Node): number {
    switch (node.type) {
      case NodeType.BinaryExpression:
        return this.evaluateBinaryExpression(node as BinaryExpressionNode);
      case NodeType.Number:
        return this.evaluateNumber(node as NumberNode);
    }
    throw new Error("Invalid node");
  }
  
  private evaluateBinaryExpression(node: BinaryExpressionNode) {
    const left = this.evaluate(node.left);
    const right = this.evaluate(node.right);
    switch (node.operator.value) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        return left / right;
    }
    throw new Error("Invalid operator");
  }
  
  private evaluateNumber(node: NumberNode) {
    return node.value;
  }
}
