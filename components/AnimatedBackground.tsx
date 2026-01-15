'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

interface AnimatedBackgroundProps {
  isCorrect?: boolean;
  isWrong?: boolean;
  intensity?: number;
}

export default function AnimatedBackground({
  isCorrect = false,
  isWrong = false,
  intensity = 1,
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const [shake, setShake] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      color: `hsl(${Math.random() * 60 + 200}, 70%, ${Math.random() * 30 + 50}%)`,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // React to correct/wrong answers
        if (isCorrect) {
          particle.vx *= 0.95;
          particle.vy *= 0.95;
        } else if (isWrong) {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const dx = particle.x - centerX;
          const dy = particle.y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const force = 5 / (distance + 1);
          particle.vx += (dx / distance) * force * intensity;
          particle.vy += (dy / distance) * force * intensity;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      // Draw connections between nearby particles
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 150, 255, ${0.2 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isCorrect, isWrong, intensity]);

  // Trigger shake effect on wrong answer
  useEffect(() => {
    if (isWrong) {
      setShake(1);
      const timer = setTimeout(() => setShake(0), 500);
      return () => clearTimeout(timer);
    }
  }, [isWrong]);

  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {/* Gradient mesh background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: isCorrect
            ? [
                'radial-gradient(circle at 20% 50%, rgba(56, 189, 248, 0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(56, 189, 248, 0.3) 0%, transparent 50%)',
              ]
            : [
                'radial-gradient(circle at 0% 0%, rgba(30, 58, 138, 0.4) 0%, transparent 50%)',
                'radial-gradient(circle at 100% 100%, rgba(88, 28, 135, 0.4) 0%, transparent 50%)',
                'radial-gradient(circle at 0% 0%, rgba(30, 58, 138, 0.4) 0%, transparent 50%)',
              ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Particle canvas */}
      <motion.canvas
        ref={canvasRef}
        className="absolute inset-0"
        animate={shake > 0 ? {
          x: [0, -10, 10, -10, 10, 0],
          y: [0, -10, 10, -10, 10, 0],
        } : {}}
        transition={{ duration: 0.5 }}
      />
      
      {/* Glow effect on correct answer */}
      {isCorrect && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 1 }}
          style={{
            background: 'radial-gradient(circle at center, rgba(34, 197, 94, 0.3) 0%, transparent 70%)',
          }}
        />
      )}
    </div>
  );
}
