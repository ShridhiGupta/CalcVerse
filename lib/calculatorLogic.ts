export type Operator = '+' | '-' | '×' | '÷';

export interface CalculatorState {
  display: string;
  previousValue: number | null;
  operator: Operator | null;
  waitingForOperand: boolean;
}

export class CalculatorEngine {
  private state: CalculatorState;

  constructor() {
    this.state = {
      display: '0',
      previousValue: null,
      operator: null,
      waitingForOperand: false,
    };
  }

  getDisplay(): string {
    return this.state.display;
  }

  inputDigit(digit: string): void {
    if (this.state.waitingForOperand) {
      this.state.display = digit;
      this.state.waitingForOperand = false;
    } else {
      this.state.display =
        this.state.display === '0' ? digit : this.state.display + digit;
    }
  }

  inputDecimal(): void {
    if (this.state.waitingForOperand) {
      this.state.display = '0.';
      this.state.waitingForOperand = false;
    } else if (this.state.display.indexOf('.') === -1) {
      this.state.display += '.';
    }
  }

  clear(): void {
    this.state = {
      display: '0',
      previousValue: null,
      operator: null,
      waitingForOperand: false,
    };
  }

  backspace(): void {
    if (!this.state.waitingForOperand) {
      if (this.state.display.length > 1) {
        this.state.display = this.state.display.slice(0, -1);
      } else {
        this.state.display = '0';
      }
    }
  }

  performOperation(nextOperator: Operator): number | null {
    const inputValue = parseFloat(this.state.display);

    if (this.state.previousValue === null) {
      this.state.previousValue = inputValue;
    } else if (this.state.operator) {
      const currentValue = this.state.previousValue || 0;
      const newValue = this.calculate(currentValue, inputValue, this.state.operator);

      this.state.display = String(newValue);
      this.state.previousValue = newValue;
    }

    this.state.waitingForOperand = true;
    this.state.operator = nextOperator;

    return this.state.previousValue;
  }

  calculate(firstValue: number, secondValue: number, operator: Operator): number {
    switch (operator) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        if (secondValue === 0) {
          throw new Error('Division by zero');
        }
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  }

  equals(): number | null {
    const inputValue = parseFloat(this.state.display);

    if (this.state.previousValue !== null && this.state.operator) {
      const newValue = this.calculate(
        this.state.previousValue,
        inputValue,
        this.state.operator
      );

      this.state.display = String(newValue);
      this.state.previousValue = null;
      this.state.operator = null;
      this.state.waitingForOperand = true;

      return newValue;
    }

    return inputValue;
  }

  getCurrentValue(): number {
    return parseFloat(this.state.display) || 0;
  }

  reset(): void {
    this.clear();
  }
}
