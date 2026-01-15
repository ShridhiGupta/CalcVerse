'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalculatorEngine, type Operator } from '@/lib/calculatorLogic';

interface CalculatorProps {
  onCalculate: (value: number) => void;
  disabled?: boolean;
}

export default function Calculator({ onCalculate, disabled = false }: CalculatorProps) {
  const [calculator] = useState(() => new CalculatorEngine());
  const [display, setDisplay] = useState('0');
  const [lastOperator, setLastOperator] = useState<Operator | null>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (disabled) return;

      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === '.') {
        handleDecimal();
      } else if (e.key === '+' || e.key === '-') {
        handleOperator(e.key as Operator);
      } else if (e.key === '*') {
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [disabled]);

  const updateDisplay = () => {
    setDisplay(calculator.getDisplay());
  };

  const handleDigit = (digit: string) => {
    calculator.inputDigit(digit);
    updateDisplay();
  };

  const handleDecimal = () => {
    calculator.inputDecimal();
    updateDisplay();
  };

  const handleOperator = (operator: Operator) => {
    calculator.performOperation(operator);
    setLastOperator(operator);
    updateDisplay();
  };

  const handleEquals = () => {
    const result = calculator.equals();
    if (result !== null && !isNaN(result) && isFinite(result)) {
      setDisplay(String(result));
      onCalculate(result);
      // Reset for next calculation after a brief delay
      setTimeout(() => {
        calculator.reset();
        setLastOperator(null);
        setDisplay('0');
      }, 500);
    }
  };

  const handleClear = () => {
    calculator.clear();
    setLastOperator(null);
    updateDisplay();
  };

  const handleBackspace = () => {
    calculator.backspace();
    updateDisplay();
  };

  const buttonClass = (isOperator = false, isSpecial = false) => {
    const base = 'rounded-lg font-semibold text-lg transition-all duration-200 active:scale-95 ';
    if (disabled) return base + 'opacity-50 cursor-not-allowed ';
    if (isSpecial) return base + 'bg-red-500 hover:bg-red-600 text-white ';
    if (isOperator) return base + 'bg-purple-600 hover:bg-purple-700 text-white ';
    return base + 'bg-gray-700 hover:bg-gray-600 text-white ';
  };

  return (
    <motion.div
      className="bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Display */}
      <div className="bg-black rounded-lg p-4 mb-4 min-h-[80px] flex items-center justify-end">
        <motion.div
          key={display}
          className="text-white text-4xl font-mono font-bold overflow-x-auto"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {display}
        </motion.div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-3">
        {/* Row 1 */}
        <button
          onClick={handleClear}
          className={buttonClass(false, true)}
          disabled={disabled}
        >
          C
        </button>
        <button
          onClick={handleBackspace}
          className={buttonClass(false, true)}
          disabled={disabled}
        >
          ⌫
        </button>
        <button
          onClick={() => handleOperator('÷')}
          className={buttonClass(true)}
          disabled={disabled}
        >
          ÷
        </button>
        <button
          onClick={() => handleOperator('×')}
          className={buttonClass(true)}
          disabled={disabled}
        >
          ×
        </button>

        {/* Row 2 */}
        <button onClick={() => handleDigit('7')} className={buttonClass()} disabled={disabled}>
          7
        </button>
        <button onClick={() => handleDigit('8')} className={buttonClass()} disabled={disabled}>
          8
        </button>
        <button onClick={() => handleDigit('9')} className={buttonClass()} disabled={disabled}>
          9
        </button>
        <button
          onClick={() => handleOperator('-')}
          className={buttonClass(true)}
          disabled={disabled}
        >
          −
        </button>

        {/* Row 3 */}
        <button onClick={() => handleDigit('4')} className={buttonClass()} disabled={disabled}>
          4
        </button>
        <button onClick={() => handleDigit('5')} className={buttonClass()} disabled={disabled}>
          5
        </button>
        <button onClick={() => handleDigit('6')} className={buttonClass()} disabled={disabled}>
          6
        </button>
        <button
          onClick={() => handleOperator('+')}
          className={buttonClass(true)}
          disabled={disabled}
        >
          +
        </button>

        {/* Row 4 */}
        <button onClick={() => handleDigit('1')} className={buttonClass()} disabled={disabled}>
          1
        </button>
        <button onClick={() => handleDigit('2')} className={buttonClass()} disabled={disabled}>
          2
        </button>
        <button onClick={() => handleDigit('3')} className={buttonClass()} disabled={disabled}>
          3
        </button>
        <button
          onClick={handleEquals}
          className="col-span-1 row-span-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          =
        </button>

        {/* Row 5 */}
        <button
          onClick={() => handleDigit('0')}
          className="col-span-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold text-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          0
        </button>
        <button onClick={handleDecimal} className={buttonClass()} disabled={disabled}>
          .
        </button>
      </div>
    </motion.div>
  );
}
