import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Settings2 } from "lucide-react";
import { type ChatSettings } from "@shared/schema";
import SettingsDialog from "./settings-dialog";
import { motion, AnimatePresence } from "framer-motion";

interface MessageInputProps {
  onSendMessage: (content: string, settings: ChatSettings) => void;
  isLoading: boolean;
  onTypingChange?: (isTyping: boolean) => void;
}

export default function MessageInput({
  onSendMessage,
  isLoading,
  onTypingChange
}: MessageInputProps) {
  const [content, setContent] = useState("");
  const [settings, setSettings] = useState<ChatSettings>({
    temperature: 1,
    systemPrompt: "You are a helpful AI assistant. Provide clear, accurate, and engaging responses. Feel free to use markdown for better formatting.",
    mode: "general"
  });

  const handleSubmit = () => {
    if (content.trim() && !isLoading) {
      onSendMessage(content.trim(), settings);
      setContent("");
      onTypingChange?.(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onTypingChange?.(e.target.value.length > 0);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-background/80 backdrop-blur-sm pb-6 pt-4 px-2 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <Textarea
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="resize-none pr-12 min-h-[80px] sm:min-h-[100px] rounded-xl shadow-lg border-2 border-green-500/20 dark:border-green-500/20 bg-white dark:bg-gray-900 focus:ring-4 focus:ring-green-500/30 focus:border-green-500/40 transition-all"
              disabled={isLoading}
            />
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-3 bottom-3"
                >
                  <Loader2 className="h-5 w-5 animate-spin text-green-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || isLoading}
              size="icon"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl hover:shadow-green-500/20 transition-all"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <SettingsDialog 
              settings={settings} 
              onSettingsChange={setSettings}
            >
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl hover:bg-green-500/10 hover:text-green-500 transition-colors border-2 border-green-500/20 hover:border-green-500/40"
              >
                <Settings2 className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </SettingsDialog>
          </div>
        </div>
      </div>
    </div>
  );
}