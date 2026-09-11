import type { ReactNode } from "react";

type AlertProps = {
  type?: "success" | "warning" | "danger" | "info";
  title?: string;
  children: ReactNode;
};

export function Alert({ type = "info", title, children }: AlertProps) {
  const styles = {
    success: "border-success/30 bg-success/10 text-success",
    warning: "border-warning/30 bg-warning/10 text-warning",
    danger: "border-danger/30 bg-danger/10 text-danger",
    info: "border-secondary/30 bg-secondary/10 text-secondary",
  };

  return (
    <div role="alert" className={`rounded-lg border px-4 py-3 text-sm ${styles[type]}`}>
      {title && <p className="mb-1 font-semibold">{title}</p>}

      <div>{children}</div>
    </div>
  );
}
