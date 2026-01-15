'use client';

import { motion } from 'framer-motion';

interface ScoreBoardProps {
  score: number;
  level: number;
  combo: number;
}

export default function ScoreBoard({ score, level, combo }: ScoreBoardProps) {
  return (
    <motion.div
      className="bg-black/60 backdrop-blur-md rounded-xl p-6 border border-white/20"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-3 gap-4 text-center">
        {/* Score */}
        <div>
          <p className="text-gray-400 text-sm mb-1">Score</p>
          <motion.p
            key={score}
            className="text-2xl font-bold text-white"
            initial={{ scale: 1.2, color: '#10b981' }}
            animate={{ scale: 1, color: '#ffffff' }}
            transition={{ duration: 0.3 }}
          >
            {score.toLocaleString()}
          </motion.p>
        </div>

        {/* Level */}
        <div>
          <p className="text-gray-400 text-sm mb-1">Level</p>
          <motion.p
            key={level}
            className="text-2xl font-bold text-purple-400"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {level}
          </motion.p>
        </div>

        {/* Combo */}
        <div>
          <p className="text-gray-400 text-sm mb-1">Combo</p>
          <motion.p
            key={combo}
            className="text-2xl font-bold text-yellow-400"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {combo}x
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
