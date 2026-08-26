export const buttonBase =
  "flex h-12 items-center justify-center rounded-full px-5 text-base font-medium transition-colors";

export const buttonVariants = {
  primary:
    "bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc]",
  secondary:
    "border border-solid border-black/[.08] hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]",
};

export type ButtonVariant = keyof typeof buttonVariants;
