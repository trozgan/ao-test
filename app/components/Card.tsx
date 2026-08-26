import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-solid border-black/[.08] bg-black/[.02] p-6 dark:border-white/[.145] dark:bg-white/[.02] ${className}`}
    >
      {children}
    </div>
  );
}
