import { View } from "react-native";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

interface ContainerProps extends ComponentProps<typeof View> {
  size?: "default" | "narrow" | "wide";
}

/**
 * Responsive container component
 * Centers content with appropriate max-width and padding
 */
export function Container({
  className,
  size = "default",
  ...props
}: ContainerProps) {
  return (
    <View
      className={cn(
        "w-full px-6",
        "web:mx-auto",
        size === "narrow" && "web:max-w-3xl",
        size === "default" && "web:max-w-5xl",
        size === "wide" && "web:max-w-7xl",
        className
      )}
      {...props}
    />
  );
}
