import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

import { Colors, Typography, FontFamily } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Map fontWeight keywords to Nunito font families
const fontWeightToFamily: Record<string, string> = {
  normal: FontFamily.regular,
  '400': FontFamily.regular,
  medium: FontFamily.medium,
  '500': FontFamily.medium,
  semibold: FontFamily.semibold,
  '600': FontFamily.semibold,
  bold: FontFamily.bold,
  '700': FontFamily.bold,
  extrabold: FontFamily.extrabold,
  '800': FontFamily.extrabold,
  black: FontFamily.black,
  '900': FontFamily.black,
};

type TextVariant =
  | 'hero'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'bodyLg'
  | 'body'
  | 'bodySm'
  | 'caption'
  | 'label'
  | 'button'
  | 'buttonSm'
  | 'stat';

type TextColor =
  | 'default'
  | 'secondary'
  | 'tertiary'
  | 'inverse'
  | 'primary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
  | 'streak'
  | 'onPrimary';

type FontWeightKey = 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';

interface TextProps extends RNTextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: TextColor;
  weight?: FontWeightKey;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export function Text({
  children,
  variant = 'body',
  color = 'default',
  weight,
  align,
  style,
  ...props
}: TextProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const getColor = (): string => {
    switch (color) {
      case 'default':
        return colors.text;
      case 'secondary':
        return colors.textSecondary;
      case 'tertiary':
        return colors.textTertiary;
      case 'inverse':
        return colors.textInverse;
      case 'onPrimary':
        return colors.textOnPrimary;
      case 'primary':
        return colors.primary;
      case 'accent':
        return colors.accent;
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      case 'streak':
        return colors.streak;
    }
  };

  const typographyStyle = Typography[variant];
  const textColor = getColor();

  return (
    <RNText
      style={[
        typographyStyle,
        { color: textColor },
        weight && { fontFamily: fontWeightToFamily[weight] },
        align && { textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}

// Convenience components for common use cases
export function Heading({
  level = 1,
  ...props
}: Omit<TextProps, 'variant'> & { level?: 1 | 2 | 3 | 4 | 5 }) {
  const variants: Record<number, TextVariant> = {
    1: 'h1',
    2: 'h2',
    3: 'h3',
    4: 'h4',
    5: 'h5',
  };
  return <Text variant={variants[level]} {...props} />;
}

export function Paragraph(props: Omit<TextProps, 'variant'>) {
  return <Text variant="body" {...props} />;
}

export function Caption(props: Omit<TextProps, 'variant'>) {
  return <Text variant="caption" color="secondary" {...props} />;
}

export function Label(props: Omit<TextProps, 'variant'>) {
  return <Text variant="label" {...props} />;
}
