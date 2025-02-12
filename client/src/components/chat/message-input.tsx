import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { type ChatSettings } from "@shared/schema";
import SettingsDialog from "./settings-dialog";

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
    systemPrompt: "You are a helpful assistant."
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
      <div className="flex gap-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="resize-none"
          rows={3}
        />
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || isLoading}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
          <SettingsDialog settings={settings} onSettingsChange={setSettings} />
        </div>
      </div>
    </div>
  );
}
