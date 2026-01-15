'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/AnimatedBackground';
import Calculator from '@/components/Calculator';
import GameHUD from '@/components/GameHUD';
import ScoreBoard from '@/components/ScoreBoard';
import { GameEngine } from '@/lib/gameEngine';

export default function GamePage() {
  const router = useRouter();
  const [gameEngine] = useState(() => new GameEngine());
  const [gameState, setGameState] = useState(gameEngine.getState());
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [points, setPoints] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Start the game
    gameEngine.startGame();
    setGameState(gameEngine.getState());

    // Update game state periodically
    const interval = setInterval(() => {
      setGameState(gameEngine.getState());
    }, 100);

    return () => {
      clearInterval(interval);
      gameEngine.stopGame();
      gameEngine.cleanup();
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, [gameEngine]);

  const handleCalculate = (value: number) => {
    if (!gameState.currentChallenge) return;

    const result = gameEngine.checkAnswer(value);
    setGameState(gameEngine.getState());

    if (result.correct) {
      setFeedback('correct');
      setPoints(result.points);
      setIsCorrect(true);
      setIsWrong(false);
      
      // Reset feedback after animation
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
      feedbackTimeoutRef.current = setTimeout(() => {
        setFeedback(null);
        setIsCorrect(false);
      }, 2000);
    } else {
      setFeedback('wrong');
      setIsWrong(true);
      setIsCorrect(false);
      
      // Reset feedback after animation
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
      feedbackTimeoutRef.current = setTimeout(() => {
        setFeedback(null);
        setIsWrong(false);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground isCorrect={isCorrect} isWrong={isWrong} intensity={2} />
      
      {/* Header with back button */}
      <div className="w-full max-w-6xl mb-4 z-10">
        <motion.button
          onClick={() => router.push('/')}
          className="text-white hover:text-gray-300 transition-colors flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span>←</span> Back to Home
        </motion.button>
      </div>

      <div className="w-full max-w-6xl grid md:grid-cols-3 gap-6 z-10">
        {/* Left Column - Score Board */}
        <div className="md:col-span-1">
          <ScoreBoard
            score={gameState.score}
            level={gameState.level}
            combo={gameState.combo}
          />
        </div>

        {/* Center Column - Game HUD and Calculator */}
        <div className="md:col-span-2 space-y-6">
          <GameHUD
            challenge={gameState.currentChallenge?.question || null}
            timeRemaining={gameState.timeRemaining}
            feedback={feedback}
            points={points}
          />

          <Calculator
            onCalculate={handleCalculate}
            disabled={!gameState.isGameActive}
          />
        </div>
      </div>
    </div>
  );
}
