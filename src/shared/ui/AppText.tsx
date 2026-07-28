import { Text, type TextProps } from 'react-native';

import { cn } from '@/shared/utils/cn';

type Variant = 'display' | 'title' | 'heading' | 'body' | 'caption' | 'label';
type Tone = 'primary' | 'secondary' | 'tertiary' | 'gold' | 'danger';

const variantClasses: Record<Variant, string> = {
  display: 'text-[34px] leading-[40px] font-bold',
  title: 'text-[28px] leading-[34px] font-bold',
  heading: 'text-[20px] leading-[26px] font-semibold',
  body: 'text-[16px] leading-[23px]',
  caption: 'text-[13px] leading-[18px]',
  label: 'text-[13px] leading-[16px] font-semibold uppercase tracking-wider',
};

const toneClasses: Record<Tone, string> = {
  primary: 'text-cream',
  secondary: 'text-mist',
  tertiary: 'text-slate',
  gold: 'text-gold',
  danger: 'text-danger',
};

export interface AppTextProps extends TextProps {
  variant?: Variant;
  tone?: Tone;
}

export function AppText({
  variant = 'body',
  tone = 'primary',
  className,
  ...props
}: AppTextProps) {
  return (
    <Text
      className={cn(variantClasses[variant], toneClasses[tone], className)}
      {...props}
    />
  );
}
