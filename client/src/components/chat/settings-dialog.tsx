import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ChatSettings, chatSettingsSchema } from "@shared/schema";
import { useState } from "react";

interface SettingsDialogProps {
  settings: ChatSettings;
  onSettingsChange: (settings: ChatSettings) => void;
  children?: React.ReactNode;
}

export default function SettingsDialog({
  settings,
  onSettingsChange,
  children,
}: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<ChatSettings>({
    resolver: zodResolver(chatSettingsSchema),
    defaultValues: settings,
  });

  const onSubmit = (data: ChatSettings) => {
    onSettingsChange(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="icon">
            <Settings2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Chat Settings
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 pt-4"
          >
            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter system prompt..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Define how the AI assistant should behave
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature: {field.value.toFixed(1)}</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={2}
                      step={0.1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="pt-2"
                    />
                  </FormControl>
                  <FormDescription>
                    Lower values make responses more focused and deterministic,
                    higher values make them more creative and varied
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" className="w-full sm:w-auto">
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}