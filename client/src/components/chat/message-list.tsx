import { type Message } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-20 flex-1" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn("flex items-start gap-3", {
            "justify-end": message.role === "user",
          })}
        >
          <Avatar className={cn("h-10 w-10", { "order-2": message.role === "user" })}>
            {message.role === "assistant" ? (
              <Bot className="h-6 w-6" />
            ) : (
              <User className="h-6 w-6" />
            )}
          </Avatar>
          <Card className={cn("p-4 max-w-[80%]", {
            "bg-primary text-primary-foreground": message.role === "user",
          })}>
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </Card>
        </div>
      ))}
    </div>
  );
}
