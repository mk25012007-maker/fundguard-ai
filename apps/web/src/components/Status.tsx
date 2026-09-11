type StatusProps = {
  type: "loading" | "error" | "empty";
  message?: string;
};

export function Status({ type, message }: StatusProps) {
  const content = {
    loading: message ?? "Loading...",
    error: message ?? "Something went wrong.",
    empty: message ?? "No data available.",
  };

  const styles = {
    loading: "text-muted",
    error: "text-danger",
    empty: "text-muted",
  };

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`flex min-h-24 items-center justify-center rounded-lg border border-border bg-surface px-4 py-6 text-sm ${styles[type]}`}
    >
      {content[type]}
    </div>
  );
}
