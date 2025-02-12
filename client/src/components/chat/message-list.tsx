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
      <div className="space-y-4 px-2 sm:px-0">
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
    <div className="space-y-6 pb-4 max-w-4xl mx-auto px-2 sm:px-4">
      {messages.map((message, index) => {
        const isUser = message.metadata.role === "user";
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            key={message.id}
            className={cn("flex items-start gap-4", {
              "justify-end": isUser,
            })}
          >
            <Avatar 
              className={cn(
                "h-10 w-10 ring-2 ring-background shadow-xl", 
                { 
                  "order-2": isUser,
                  "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-green-500/20": isUser,
                  "bg-gradient-to-br from-teal-400 to-emerald-600 text-white shadow-emerald-500/20": !isUser
                }
              )}
            >
              {message.metadata.role === "assistant" ? (
                <Bot className="h-5 w-5" />
              ) : (
                <User className="h-5 w-5" />
              )}
            </Avatar>
            <Card 
              className={cn(
                "p-4 max-w-[85%] sm:max-w-[75%] shadow-lg transition-colors backdrop-blur-sm", 
                {
                  "bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-tr-none shadow-xl shadow-green-500/20": isUser,
                  "bg-white dark:bg-gray-900 border-2 border-green-500/20 dark:border-green-500/20 prose-pre:bg-gray-800/50 prose-sm dark:prose-invert max-w-none shadow-xl shadow-emerald-500/10 rounded-tl-none": !isUser
                }
              )}
            >
              {message.metadata.role === "assistant" ? (
                <ReactMarkdown className="text-sm whitespace-pre-wrap prose prose-slate dark:prose-invert">
                  {message.content}
                </ReactMarkdown>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              )}
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}