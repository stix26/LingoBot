import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface MascotProps {
  sentiment?: { score: number; confidence: number };
  isTyping?: boolean;
  isThinking?: boolean;
}

export default function Mascot({ sentiment, isTyping, isThinking }: MascotProps) {
  const [expression, setExpression] = useState<"happy" | "neutral" | "sad" | "thinking">("neutral");

  useEffect(() => {
    if (isThinking) {
      setExpression("thinking");
    } else if (sentiment && typeof sentiment.score === 'number') {
      if (sentiment.score >= 4) {
        setExpression("happy");
      } else if (sentiment.score <= 2) {
        setExpression("sad");
      } else {
        setExpression("neutral");
      }
    }
  }, [sentiment, isThinking]);

  return (
    <motion.div 
      className="fixed bottom-28 right-4 w-16 h-16 pointer-events-none z-10"
      animate={{
        scale: isTyping ? [1, 1.1, 1] : 1,
        y: isTyping ? [0, -5, 0] : 0,
        rotate: isThinking ? [0, -5, 5, -5, 0] : 0
      }}
      transition={{
        duration: isTyping ? 0.3 : 0.5,
        repeat: isTyping ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className={cn(
          "w-full h-full filter drop-shadow-lg",
          {
            "text-violet-500": expression === "neutral",
            "text-green-500": expression === "happy",
            "text-blue-500": expression === "sad",
            "text-yellow-500": expression === "thinking"
          }
        )}
      >
        {/* Base circle with gradient */}
        <defs>
          <radialGradient id="mascotGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{ stopColor: 'currentColor', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: 0.8 }} />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#mascotGradient)" />

        {/* Eyes with animations */}
        {expression === "happy" && (
          <>
            {/* Curved happy eyes */}
            <motion.path
              d="M30 45 Q40 35, 50 45"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.path
              d="M50 45 Q60 35, 70 45"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
          </>
        )}

        {expression === "neutral" && (
          <>
            <motion.circle 
              cx="35" 
              cy="45" 
              r="4" 
              fill="white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.circle 
              cx="65" 
              cy="45" 
              r="4" 
              fill="white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            />
          </>
        )}

        {expression === "sad" && (
          <>
            <motion.path
              d="M30 50 Q40 45, 50 50"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.path
              d="M50 50 Q60 45, 70 50"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
          </>
        )}

        {expression === "thinking" && (
          <>
            <motion.circle cx="35" cy="45" r="4" fill="white" />
            <motion.circle cx="65" cy="45" r="4" fill="white" />
            {/* Thinking bubble */}
            <motion.g
              animate={{
                y: [-2, 2, -2],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <circle cx="85" cy="30" r="8" fill="white" opacity="0.6" />
              <circle cx="75" cy="20" r="6" fill="white" opacity="0.4" />
              <circle cx="65" cy="15" r="4" fill="white" opacity="0.2" />
            </motion.g>
          </>
        )}

        {/* Mouth with animations */}
        {expression === "happy" && (
          <motion.path
            d="M30 65 Q50 80, 70 65"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {expression === "neutral" && (
          <motion.line
            x1="35"
            y1="65"
            x2="65"
            y2="65"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {expression === "sad" && (
          <motion.path
            d="M30 75 Q50 65, 70 75"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {expression === "thinking" && (
          <motion.path
            d="M35 65 Q50 65, 65 65"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </svg>
    </motion.div>
  );
}