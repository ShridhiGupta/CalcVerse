'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface GameHUDProps {
  challenge: string | null;
  timeRemaining: number;
  feedback: 'correct' | 'wrong' | null;
  points?: number;
}

export default function GameHUD({
  challenge,
  timeRemaining,
  feedback,
  points = 0,
}: GameHUDProps) {
  const timePercentage = (timeRemaining / 30) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Challenge Display */}
      <motion.div
        className="bg-black/60 backdrop-blur-md rounded-xl p-6 border border-white/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <p className="text-gray-300 text-sm mb-2">Challenge</p>
          <motion.h2
            key={challenge}
            className="text-3xl font-bold text-white"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {challenge || 'Get ready...'}
          </motion.h2>
        </div>
      </motion.div>

      {/* Timer */}
      <div className="bg-black/60 backdrop-blur-md rounded-xl p-4 border border-white/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300 text-sm">Time</span>
          <span className="text-white font-bold">{timeRemaining}s</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
          <motion.div
            className={`h-full ${
              timePercentage > 50
                ? 'bg-green-500'
                : timePercentage > 25
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            initial={{ width: '100%' }}
            animate={{ width: `${timePercentage}%` }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </div>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback === 'correct' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-green-500/80 backdrop-blur-md rounded-xl p-4 border border-green-400/50 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="text-4xl mb-2"
            >
              ✓
            </motion.div>
            <p className="text-white font-bold text-xl">Correct!</p>
            {points > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-100 mt-1"
              >
                +{points} points
              </motion.p>
            )}
          </motion.div>
        )}

        {feedback === 'wrong' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-red-500/80 backdrop-blur-md rounded-xl p-4 border border-red-400/50 text-center"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="text-4xl mb-2"
            >
              ✗
            </motion.div>
            <p className="text-white font-bold text-xl">Wrong Answer!</p>
            <p className="text-red-100 mt-1 text-sm">Try again</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
