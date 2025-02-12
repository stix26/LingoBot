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
    <div className="space-y-6 pb-4 max-w-4xl mx-auto">
      {messages.map((message, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          key={message.id}
          className={cn("flex items-start gap-4", {
            "justify-end": message.role === "user",
          })}
        >
          <Avatar 
            className={cn(
              "h-10 w-10 ring-2 ring-background shadow-xl", 
              { 
                "order-2": message.role === "user",
                "bg-gradient-to-br from-blue-500 to-violet-600 text-white": message.role === "user",
                "bg-gradient-to-br from-rose-400 to-pink-600 text-white": message.role === "assistant"
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
              "p-4 max-w-[85%] shadow-lg transition-colors backdrop-blur-sm", 
              {
                "bg-gradient-to-r from-blue-500 to-violet-600 text-white rounded-tr-none": message.role === "user",
                "bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 prose-pre:bg-gray-800/50 prose-sm dark:prose-invert max-w-none shadow-xl rounded-tl-none": message.role === "assistant"
              }
            )}
          >
            {message.role === "assistant" ? (
              <ReactMarkdown className="text-sm whitespace-pre-wrap prose prose-slate dark:prose-invert">
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