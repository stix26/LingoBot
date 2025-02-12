import { type Message } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

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
    <div className="space-y-6 pb-4">
      {messages.map((message, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          key={message.id}
          className={cn("flex items-start gap-4", {
            "justify-end": message.role === "user",
          })}
        >
          <Avatar 
            className={cn(
              "h-10 w-10 ring-2 ring-background shadow-md", 
              { 
                "order-2": message.role === "user",
                "bg-gradient-to-br from-violet-600 to-indigo-600 text-white": message.role === "user",
                "bg-gradient-to-br from-pink-500 to-rose-500 text-white": message.role === "assistant"
              }
            )}
          >
            {message.role === "assistant" ? (
              <Bot className="h-5 w-5" />
            ) : (
              <User className="h-5 w-5" />
            )}
          </Avatar>
          <Card 
            className={cn(
              "p-4 max-w-[80%] shadow-lg transition-colors", 
              {
                "bg-gradient-to-r from-violet-600 to-indigo-600 text-white": message.role === "user",
                "bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 prose-pre:bg-gray-800/50 prose-sm dark:prose-invert max-w-none shadow-xl": message.role === "assistant"
              }
            )}
          >
            {message.role === "assistant" ? (
              <ReactMarkdown className="text-sm whitespace-pre-wrap">
                {message.content}
              </ReactMarkdown>
            ) : (
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  );
}