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
    } else if (sentiment) {
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
      className="fixed bottom-28 right-4 w-12 h-12 pointer-events-none z-10"
      animate={{
        scale: isTyping ? [1, 1.1, 1] : 1,
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
          "w-full h-full drop-shadow-lg",
          {
            "text-violet-500": expression === "neutral",
            "text-green-500": expression === "happy",
            "text-blue-500": expression === "sad",
            "text-yellow-500": expression === "thinking"
          }
        )}
      >
        {/* Base circle */}
        <circle cx="50" cy="50" r="45" fill="currentColor" />

        {/* Eyes */}
        {expression === "happy" && (
          <>
            <path
              d="M35 45 Q40 40, 45 45"
              stroke="white"
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M55 45 Q60 40, 65 45"
              stroke="white"
              strokeWidth="3"
              fill="none"
            />
          </>
        )}

        {expression === "neutral" && (
          <>
            <circle cx="40" cy="45" r="3" fill="white" />
            <circle cx="60" cy="45" r="3" fill="white" />
          </>
        )}

        {expression === "sad" && (
          <>
            <path
              d="M35 50 Q40 45, 45 50"
              stroke="white"
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M55 50 Q60 45, 65 50"
              stroke="white"
              strokeWidth="3"
              fill="none"
            />
          </>
        )}

        {expression === "thinking" && (
          <>
            <circle cx="40" cy="45" r="3" fill="white" />
            <circle cx="60" cy="45" r="3" fill="white" />
            <circle cx="75" cy="35" r="8" fill="white" opacity="0.6">
              <animate
                attributeName="opacity"
                values="0.6;0.3;0.6"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </>
        )}

        {/* Mouth */}
        {expression === "happy" && (
          <path
            d="M35 60 Q50 70, 65 60"
            stroke="white"
            strokeWidth="3"
            fill="none"
          />
        )}

        {expression === "neutral" && (
          <line
            x1="40"
            y1="65"
            x2="60"
            y2="65"
            stroke="white"
            strokeWidth="3"
          />
        )}

        {expression === "sad" && (
          <path
            d="M35 70 Q50 60, 65 70"
            stroke="white"
            strokeWidth="3"
            fill="none"
          />
        )}

        {expression === "thinking" && (
          <path
            d="M40 65 Q50 65, 60 65"
            stroke="white"
            strokeWidth="3"
            fill="none"
          />
        )}
      </svg>
    </motion.div>
  );
}