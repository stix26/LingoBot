import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { avatarCustomizationSchema, type AvatarCustomization } from "@shared/schema";
import { Circle, Hexagon, Square, Paintbrush } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
    values: settings
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
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Customize Your AI Companion
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="shape"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shape</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-4"
                    >
                      {[
                        { value: "circle", icon: Circle },
                        { value: "squircle", icon: Square },
                        { value: "hexagon", icon: Hexagon },
                      ].map(({ value, icon: Icon }) => (
                        <FormItem key={value}>
                          <FormControl>
                            <RadioGroupItem value={value} className="sr-only" />
                          </FormControl>
                          <label
                            htmlFor={value}
                            className={cn(
                              "flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer",
                              "transition-all duration-200 ease-in-out",
                              "hover:border-accent hover:bg-accent/5 hover:scale-105",
                              field.value === value ? [
                                "border-primary bg-primary/5",
                                "ring-2 ring-primary/20",
                                "scale-110 shadow-lg"
                              ] : "border-muted"
                            )}
                          >
                            <Icon className="h-6 w-6" />
                          </label>
                        </FormItem>
                      ))}
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
                      value={field.value}
                      className="grid grid-cols-3 gap-4"
                    >
                      {["minimal", "cute", "robot"].map((style) => (
                        <FormItem key={style}>
                          <FormControl>
                            <RadioGroupItem value={style} className="sr-only" />
                          </FormControl>
                          <label
                            htmlFor={style}
                            className={cn(
                              "block p-4 rounded-lg border-2 cursor-pointer",
                              "transition-all duration-200 ease-in-out",
                              "hover:border-accent hover:bg-accent/5 hover:scale-105",
                              field.value === style ? [
                                "border-primary bg-primary/5",
                                "ring-2 ring-primary/20",
                                "scale-110 shadow-lg"
                              ] : "border-muted"
                            )}
                          >
                            <span className="block text-center">
                              {style.charAt(0).toUpperCase() + style.slice(1)}
                            </span>
                          </label>
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
                      value={field.value}
                      className="grid grid-cols-3 gap-4"
                    >
                      {["bounce", "pulse", "wave"].map((animation) => (
                        <FormItem key={animation}>
                          <FormControl>
                            <RadioGroupItem value={animation} className="sr-only" />
                          </FormControl>
                          <label
                            htmlFor={animation}
                            className={cn(
                              "block p-4 rounded-lg border-2 cursor-pointer",
                              "transition-all duration-200 ease-in-out",
                              "hover:border-accent hover:bg-accent/5 hover:scale-105",
                              field.value === animation ? [
                                "border-primary bg-primary/5",
                                "ring-2 ring-primary/20",
                                "scale-110 shadow-lg"
                              ] : "border-muted"
                            )}
                          >
                            <span className="block text-center">
                              {animation.charAt(0).toUpperCase() + animation.slice(1)}
                            </span>
                          </label>
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
                    "focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    form.getValues("primaryColor") === color.primary && [
                      "ring-2 ring-primary ring-offset-2",
                      "scale-110 shadow-lg",
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
                className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium"
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