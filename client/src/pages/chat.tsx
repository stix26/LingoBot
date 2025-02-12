import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import MessageList from "@/components/chat/message-list";
import MessageInput from "@/components/chat/message-input";
import ChatHeader from "@/components/chat/chat-header";
import { type Message, type ChatSettings } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export default function Chat() {
  const { toast } = useToast();

  const messagesQuery = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, settings }: { content: string, settings: ChatSettings }) => {
      const res = await apiRequest("POST", "/api/messages", {
        content,
        role: "user",
        settings
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
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
      toast({
        title: "Success",
        description: "Chat history cleared",
      });
    },
  });

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <ChatHeader onClearChat={() => clearChatMutation.mutate()} />
      <ScrollArea className="flex-1 px-4 pb-32">
        <MessageList
          messages={messagesQuery.data || []}
          isLoading={messagesQuery.isLoading}
        />
      </ScrollArea>
      <MessageInput
        onSendMessage={(content, settings) =>
          sendMessageMutation.mutate({ content, settings })
        }
        isLoading={sendMessageMutation.isPending}
      />
    </div>
  );
}