import { H1, H2, H3, H4, H5, P, A } from "@expo/html-elements";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

/**
 * SEO-friendly typography components using @expo/html-elements
 * These render semantic HTML on web (<h1>, <p>, etc.) for better SEO
 * while working as normal Text components on native
 */

// Hero heading (site landing pages)
const heroVariants = cva("font-extrabold text-foreground tracking-tight", {
  variants: {
    size: {
      default: "text-4xl web:text-5xl",
      lg: "text-5xl web:text-6xl",
    },
  },
  defaultVariants: { size: "default" },
});

export function Hero({
  className,
  size,
  ...props
}: ComponentProps<typeof H1> & VariantProps<typeof heroVariants>) {
  return <H1 className={cn(heroVariants({ size, className }))} {...props} />;
}

// Section headings
const headingVariants = cva("font-bold text-foreground", {
  variants: {
    level: {
      1: "text-3xl web:text-4xl tracking-tight",
      2: "text-2xl web:text-3xl",
      3: "text-xl web:text-2xl",
      4: "text-lg web:text-xl font-semibold",
      5: "text-base web:text-lg font-semibold",
    },
  },
  defaultVariants: { level: 2 },
});

type HeadingLevel = 1 | 2 | 3 | 4 | 5;

interface HeadingProps
  extends Omit<ComponentProps<typeof H2>, "level">,
    Omit<VariantProps<typeof headingVariants>, "level"> {
  level?: HeadingLevel;
}

export function Heading({ level = 2, className, ...props }: HeadingProps) {
  const Component =
    level === 1
      ? H1
      : level === 2
        ? H2
        : level === 3
          ? H3
          : level === 4
            ? H4
            : H5;
  return (
    <Component
      className={cn(headingVariants({ level, className }))}
      {...props}
    />
  );
}

// Body text
const paragraphVariants = cva("text-foreground", {
  variants: {
    size: {
      default: "text-base leading-relaxed",
      lg: "text-lg leading-relaxed",
      sm: "text-sm leading-normal",
      xs: "text-xs leading-normal",
    },
    color: {
      default: "",
      muted: "text-muted-foreground",
      primary: "text-primary",
    },
  },
  defaultVariants: { size: "default", color: "default" },
});

export function Paragraph({
  className,
  size,
  color,
  ...props
}: ComponentProps<typeof P> & VariantProps<typeof paragraphVariants>) {
  return (
    <P className={cn(paragraphVariants({ size, color, className }))} {...props} />
  );
}

// Lead paragraph (intro text)
export function Lead({ className, ...props }: ComponentProps<typeof P>) {
  return (
    <P
      className={cn(
        "text-lg web:text-xl text-muted-foreground leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

// Caption text
export function Caption({ className, ...props }: ComponentProps<typeof P>) {
  return (
    <P
      className={cn("text-xs text-muted-foreground font-medium", className)}
      {...props}
    />
  );
}

// Links (external)
export function ExternalLink({ className, ...props }: ComponentProps<typeof A>) {
  return (
    <A
      className={cn(
        "text-primary underline-offset-4 web:hover:underline font-medium",
        className
      )}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  );
}
