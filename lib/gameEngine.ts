import type { Operator } from './calculatorLogic';

export interface GameChallenge {
  question: string;
  answer: number;
  expression: string;
}

export interface GameState {
  score: number;
  level: number;
  currentChallenge: GameChallenge | null;
  combo: number;
  timeRemaining: number;
  isGameActive: boolean;
}

export class GameEngine {
  private state: GameState;
  private timerInterval: NodeJS.Timeout | null = null;
  private readonly TIME_PER_QUESTION = 30; // seconds

  constructor() {
    this.state = {
      score: 0,
      level: 1,
      currentChallenge: null,
      combo: 0,
      timeRemaining: this.TIME_PER_QUESTION,
      isGameActive: false,
    };
  }

  getState(): GameState {
    return { ...this.state };
  }

  startGame(): void {
    this.state.isGameActive = true;
    this.state.score = 0;
    this.state.level = 1;
    this.state.combo = 0;
    this.generateChallenge();
    this.startTimer();
  }

  stopGame(): void {
    this.state.isGameActive = false;
    this.stopTimer();
  }

  generateChallenge(): GameChallenge {
    const level = this.state.level;
    let num1: number, num2: number, operator: Operator, answer: number;
    let expression: string;

    // Easy: single digit addition/subtraction
    if (level <= 3) {
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      operator = Math.random() > 0.5 ? '+' : '-';
      answer = operator === '+' ? num1 + num2 : num1 - num2;
      expression = `${num1} ${operator} ${num2}`;
    }
    // Medium: double digit with all operations
    else if (level <= 6) {
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 50) + 1;
      const ops: Operator[] = ['+', '-', '×'];
      operator = ops[Math.floor(Math.random() * ops.length)];
      
      if (operator === '+') answer = num1 + num2;
      else if (operator === '-') answer = num1 - num2;
      else answer = num1 * num2;
      
      expression = `${num1} ${operator} ${num2}`;
    }
    // Hard: larger numbers with division
    else {
      const ops: Operator[] = ['+', '-', '×', '÷'];
      operator = ops[Math.floor(Math.random() * ops.length)];
      
      if (operator === '÷') {
        num2 = Math.floor(Math.random() * 10) + 2;
        answer = Math.floor(Math.random() * 10) + 1;
        num1 = num2 * answer;
        expression = `${num1} ${operator} ${num2}`;
      } else {
        num1 = Math.floor(Math.random() * 100) + 10;
        num2 = Math.floor(Math.random() * 100) + 10;
        if (operator === '+') answer = num1 + num2;
        else if (operator === '-') answer = num1 - num2;
        else answer = num1 * num2;
        expression = `${num1} ${operator} ${num2}`;
      }
    }

    const challenge: GameChallenge = {
      question: `Solve: ${expression}`,
      answer,
      expression,
    };

    this.state.currentChallenge = challenge;
    this.state.timeRemaining = this.TIME_PER_QUESTION;
    return challenge;
  }

  checkAnswer(userAnswer: number): { correct: boolean; points: number } {
    if (!this.state.currentChallenge) {
      return { correct: false, points: 0 };
    }

    const correct = Math.abs(userAnswer - this.state.currentChallenge.answer) < 0.001;
    
    if (correct) {
      this.state.combo += 1;
      const basePoints = 10 * this.state.level;
      const comboBonus = Math.min(this.state.combo * 2, 50);
      const timeBonus = Math.floor(this.state.timeRemaining * 2);
      const points = basePoints + comboBonus + timeBonus;
      
      this.state.score += points;
      
      // Level up every 3 correct answers
      if (this.state.combo % 3 === 0) {
        this.state.level += 1;
      }
      
      this.generateChallenge();
      return { correct: true, points };
    } else {
      this.state.combo = 0;
      return { correct: false, points: 0 };
    }
  }

  private startTimer(): void {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      if (this.state.isGameActive) {
        this.state.timeRemaining -= 1;
        if (this.state.timeRemaining <= 0) {
          this.state.timeRemaining = 0;
          this.state.combo = 0;
          this.generateChallenge();
        }
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  cleanup(): void {
    this.stopTimer();
  }
}
