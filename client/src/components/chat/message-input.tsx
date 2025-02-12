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
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="resize-none pr-12 min-h-[100px]"
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
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || isLoading}
            size="icon"
            className="h-10 w-10"
          >
            <Send className="h-4 w-4" />
          </Button>
          <SettingsDialog 
            settings={settings} 
            onSettingsChange={setSettings}
          >
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </SettingsDialog>
        </div>
      </div>
    </div>
  );
}