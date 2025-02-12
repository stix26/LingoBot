import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import MessageList from "@/components/chat/message-list";
import MessageInput from "@/components/chat/message-input";
import ChatHeader from "@/components/chat/chat-header";
import Mascot from "@/components/chat/mascot";
import SuggestionChips from "@/components/chat/suggestion-chips";
import { type Message, type ChatSettings } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useState } from "react";

export default function Chat() {
  const { toast } = useToast();
  const [isTyping, setIsTyping] = useState(false);

  const messagesQuery = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });

  const suggestionsQuery = useQuery<string[]>({
    queryKey: ["/api/suggestions"],
    enabled: !!messagesQuery.data?.length, // Only fetch suggestions if there are messages
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, settings }: { content: string; settings: ChatSettings }) => {
      const res = await apiRequest("POST", "/api/messages", {
        content,
        settings,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/suggestions"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const clearChatMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/messages/clear");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/suggestions"] });
      toast({
        title: "Success",
        description: "Chat history cleared",
      });
    },
  });

  // Get the latest message sentiment
  const latestMessage = messagesQuery.data?.[messagesQuery.data?.length - 1];
  const sentiment = latestMessage?.metadata?.sentiment;

  const handleSuggestionSelect = (suggestion: string) => {
    const defaultSettings: ChatSettings = {
      temperature: 1,
      systemPrompt: "You are a helpful AI assistant. Provide clear, accurate, and engaging responses. Feel free to use markdown for better formatting.",
      mode: "general" as const,
    };
    sendMessageMutation.mutate({ content: suggestion, settings: defaultSettings });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <ChatHeader onClearChat={() => clearChatMutation.mutate()} />
      <ScrollArea className="flex-1 px-4 pb-32">
        <MessageList
          messages={messagesQuery.data || []}
          isLoading={messagesQuery.isLoading}
        />
        <div className="mt-4">
          <SuggestionChips
            suggestions={suggestionsQuery.data || []}
            onSelect={handleSuggestionSelect}
            isLoading={suggestionsQuery.isLoading}
          />
        </div>
      </ScrollArea>
      <MessageInput
        onSendMessage={(content, settings) => sendMessageMutation.mutate({ content, settings })}
        isLoading={sendMessageMutation.isPending}
        onTypingChange={setIsTyping}
      />
      <Mascot
        sentiment={sentiment ? { score: sentiment, confidence: 1 } : undefined}
        isTyping={isTyping}
        isThinking={sendMessageMutation.isPending}
      />
    </div>
  );
}