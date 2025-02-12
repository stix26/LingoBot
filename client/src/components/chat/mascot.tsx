import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { type AvatarCustomization } from "@shared/schema";

interface MascotProps {
  sentiment?: { score: number; confidence: number };
  isTyping?: boolean;
  isThinking?: boolean;
  customization?: AvatarCustomization;
}

export default function Mascot({
  sentiment,
  isTyping,
  isThinking,
  customization = {
    primaryColor: "hsl(142 76% 36%)",
    secondaryColor: "hsl(142 76% 46%)",
    shape: "circle",
    style: "minimal",
    animation: "bounce"
  }
}: MascotProps) {
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

  const getAnimationProps = () => {
    switch (customization.animation) {
      case "bounce":
        return {
          animate: {
            scale: isTyping ? [1, 1.1, 1] : 1,
            y: isTyping ? [0, -5, 0] : 0,
            rotate: isThinking ? [0, -5, 5, -5, 0] : 0
          },
          transition: {
            duration: isTyping ? 0.3 : 0.5,
            repeat: isTyping ? Infinity : 0,
            ease: "easeInOut"
          }
        };
      case "pulse":
        return {
          animate: {
            scale: isTyping ? [1, 1.05, 1] : 1,
            opacity: isTyping ? [1, 0.8, 1] : 1
          },
          transition: {
            duration: 1,
            repeat: isTyping ? Infinity : 0,
            ease: "easeInOut"
          }
        };
      case "wave":
        return {
          animate: {
            rotate: isTyping ? [-3, 3, -3] : 0
          },
          transition: {
            duration: 0.5,
            repeat: isTyping ? Infinity : 0,
            ease: "easeInOut"
          }
        };
    }
  };

  const getMascotShape = () => {
    switch (customization.shape) {
      case "circle":
        return "rounded-full";
      case "squircle":
        return "rounded-2xl";
      case "hexagon":
        return "clip-path-hexagon";
    }
  };

  return (
    <motion.div 
      className={cn(
        "fixed bottom-28 right-4 w-16 h-16 pointer-events-none z-10",
        getMascotShape()
      )}
      {...getAnimationProps()}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full filter drop-shadow-lg"
      >
        <defs>
          <radialGradient id="mascotGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{ stopColor: customization.primaryColor }} />
            <stop offset="100%" style={{ stopColor: customization.secondaryColor }} />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#mascotGradient)" />

        {customization.style === "minimal" && (
          <>
            {/* Minimal style - current expressions */}
            {expression === "happy" && (
              <>
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

            {/* Mouth expressions */}
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
          </>
        )}

        {customization.style === "cute" && (
          <>
            {/* Cute style - rounder, bigger eyes */}
            <circle cx="35" cy="45" r="6" fill="white" />
            <circle cx="65" cy="45" r="6" fill="white" />
            <circle cx="35" cy="45" r="3" fill="black" />
            <circle cx="65" cy="45" r="3" fill="black" />
            {expression !== "sad" && (
              <circle cx="35" cy="43" r="1" fill="white" />
            )}
            {expression !== "sad" && (
              <circle cx="65" cy="43" r="1" fill="white" />
            )}
            <motion.path
              d={expression === "happy" 
                ? "M35 65 Q50 75, 65 65" 
                : expression === "sad"
                ? "M35 70 Q50 65, 65 70"
                : "M35 67 Q50 67, 65 67"}
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}

        {customization.style === "robot" && (
          <>
            {/* Robot style - geometric shapes */}
            <rect x="30" y="40" width="15" height="10" fill="white" rx="2" />
            <rect x="55" y="40" width="15" height="10" fill="white" rx="2" />
            {expression === "happy" && (
              <path d="M35 65 L45 70 L55 70 L65 65" stroke="white" strokeWidth="4" fill="none" />
            )}
            {expression === "sad" && (
              <path d="M35 70 L45 65 L55 65 L65 70" stroke="white" strokeWidth="4" fill="none" />
            )}
            {expression === "neutral" && (
              <rect x="35" y="65" width="30" height="4" fill="white" rx="2" />
            )}
          </>
        )}

        {/* Thinking bubble */}
        {isThinking && (
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
        )}
      </svg>
    </motion.div>
  );
}