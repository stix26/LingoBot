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
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { avatarCustomizationSchema, type AvatarCustomization } from "@shared/schema";
import { Circle, Hexagon, Square, Paintbrush } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarCustomizerProps {
  settings: AvatarCustomization;
  onSettingsChange: (settings: AvatarCustomization) => void;
  children?: React.ReactNode;
}

const COLORS = [
  { name: "Green", primary: "hsl(142 76% 36%)", secondary: "hsl(142 76% 46%)" },
  { name: "Blue", primary: "hsl(221 83% 53%)", secondary: "hsl(217 91% 60%)" },
  { name: "Purple", primary: "hsl(271 91% 65%)", secondary: "hsl(262 83% 58%)" },
  { name: "Pink", primary: "hsl(339 90% 51%)", secondary: "hsl(331 86% 60%)" },
  { name: "Orange", primary: "hsl(27 96% 61%)", secondary: "hsl(21 90% 48%)" },
];

export default function AvatarCustomizer({
  settings,
  onSettingsChange,
  children,
}: AvatarCustomizerProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<AvatarCustomization>({
    resolver: zodResolver(avatarCustomizationSchema),
    defaultValues: settings,
  });

  const onSubmit = (data: AvatarCustomization) => {
    onSettingsChange(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="icon">
            <Paintbrush className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Customize Your AI Companion
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 pt-4"
          >
            <FormField
              control={form.control}
              name="shape"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shape</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="circle" className="peer sr-only" />
                        </FormControl>
                        <div className={cn(
                          "p-2 rounded-lg border-2 hover:border-accent cursor-pointer",
                          "transition-all duration-200 ease-in-out transform hover:scale-105",
                          "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
                          "peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary/20"
                        )}>
                          <Circle className="h-6 w-6" />
                        </div>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="squircle" className="peer sr-only" />
                        </FormControl>
                        <div className={cn(
                          "p-2 rounded-lg border-2 hover:border-accent cursor-pointer",
                          "transition-all duration-200 ease-in-out transform hover:scale-105",
                          "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
                          "peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary/20"
                        )}>
                          <Square className="h-6 w-6" />
                        </div>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="hexagon" className="peer sr-only" />
                        </FormControl>
                        <div className={cn(
                          "p-2 rounded-lg border-2 hover:border-accent cursor-pointer",
                          "transition-all duration-200 ease-in-out transform hover:scale-105",
                          "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
                          "peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary/20"
                        )}>
                          <Hexagon className="h-6 w-6" />
                        </div>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Style</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-3 gap-4"
                    >
                      {["minimal", "cute", "robot"].map((style) => (
                        <FormItem key={style}>
                          <FormControl>
                            <RadioGroupItem
                              value={style}
                              className="peer sr-only"
                            />
                          </FormControl>
                          <div className={cn(
                            "rounded-lg border-2 border-muted p-4 hover:border-accent",
                            "text-center cursor-pointer transition-all duration-200",
                            "hover:shadow-lg hover:scale-105",
                            "peer-data-[state=checked]:border-primary",
                            "peer-data-[state=checked]:bg-primary/5",
                            "peer-data-[state=checked]:ring-2",
                            "peer-data-[state=checked]:ring-primary/20",
                            "peer-data-[state=checked]:shadow-lg",
                            "peer-data-[state=checked]:scale-105"
                          )}>
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                          </div>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="animation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Animation</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-3 gap-4"
                    >
                      {["bounce", "pulse", "wave"].map((animation) => (
                        <FormItem key={animation}>
                          <FormControl>
                            <RadioGroupItem
                              value={animation}
                              className="peer sr-only"
                            />
                          </FormControl>
                          <div className={cn(
                            "rounded-lg border-2 border-muted p-4 hover:border-accent",
                            "text-center cursor-pointer transition-all duration-200",
                            "hover:shadow-lg hover:scale-105",
                            "peer-data-[state=checked]:border-primary",
                            "peer-data-[state=checked]:bg-primary/5",
                            "peer-data-[state=checked]:ring-2",
                            "peer-data-[state=checked]:ring-primary/20",
                            "peer-data-[state=checked]:shadow-lg",
                            "peer-data-[state=checked]:scale-105"
                          )}>
                            {animation.charAt(0).toUpperCase() + animation.slice(1)}
                          </div>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-5 gap-2">
              {COLORS.map((color) => (
                <Button
                  key={color.name}
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full h-12 rounded-lg p-0 transition-all duration-200",
                    "hover:scale-105 hover:shadow-lg",
                    form.getValues("primaryColor") === color.primary && [
                      "ring-2 ring-primary",
                      "scale-105 shadow-lg",
                      "border-primary"
                    ]
                  )}
                  onClick={() => {
                    form.setValue("primaryColor", color.primary);
                    form.setValue("secondaryColor", color.secondary);
                  }}
                >
                  <div
                    className="w-full h-full rounded-md"
                    style={{
                      background: `linear-gradient(135deg, ${color.primary}, ${color.secondary})`,
                    }}
                  />
                </Button>
              ))}
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}