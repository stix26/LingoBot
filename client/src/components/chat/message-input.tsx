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
}

export default function MessageInput({
  onSendMessage,
  isLoading,
}: MessageInputProps) {
  const [content, setContent] = useState("");
  const [settings, setSettings] = useState<ChatSettings>({
    model: "gpt-4o",
    temperature: 1,
    systemPrompt: "You are a helpful AI assistant. Provide clear, accurate, and engaging responses. Feel free to use markdown for better formatting."
  });

  const handleSubmit = () => {
    if (content.trim() && !isLoading) {
      onSendMessage(content.trim(), settings);
      setContent("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background to-background/80 backdrop-blur-sm pb-6 pt-4 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="resize-none pr-12 min-h-[100px] rounded-xl shadow-lg border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-violet-500/20"
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
                  <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || isLoading}
              size="icon"
              className="h-12 w-12 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg"
            >
              <Send className="h-5 w-5" />
            </Button>
            <SettingsDialog 
              settings={settings} 
              onSettingsChange={setSettings}
            >
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-xl hover:bg-violet-500/10 hover:text-violet-500 transition-colors"
              >
                <Settings2 className="h-5 w-5" />
              </Button>
            </SettingsDialog>
          </div>
        </div>
      </div>
    </div>
  );
}