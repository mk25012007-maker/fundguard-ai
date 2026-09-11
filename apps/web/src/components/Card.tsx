import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
  children: ReactNode;
};

export function Card({ title, description, children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface p-6 shadow-sm ${className}`}
      {...props}
    >
      {title && <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>}

      {description && <p className="mb-4 text-sm text-muted">{description}</p>}

      {children}
    </div>
  );
}
