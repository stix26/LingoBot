import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface SuggestionChipsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  isLoading?: boolean;
}

export default function SuggestionChips({
  suggestions,
  onSelect,
  isLoading = false,
}: SuggestionChipsProps) {
  if (!suggestions.length && !isLoading) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="h-4 w-4 text-yellow-500" />
        <span className="text-sm text-muted-foreground">Try asking:</span>
      </div>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="h-9 w-32 animate-pulse rounded-full bg-muted"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: { delay: index * 0.1 } 
                }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 hover:from-violet-500/20 hover:to-purple-500/20"
                  onClick={() => onSelect(suggestion)}
                >
                  {suggestion}
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
