import { Pressable } from "react-native";
import { Link, type Href } from "expo-router";

import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface InlineLinkProps {
  href: Href;
  children: React.ReactNode;
}

/**
 * Inline link component for use within paragraphs
 */
export function InlineLink({ href, children }: InlineLinkProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  return (
    <Link href={href} asChild>
      <Pressable>
        <Text variant="body" weight="semibold" style={{ color: colors.primary }}>
          {children}
        </Text>
      </Pressable>
    </Link>
  );
}
