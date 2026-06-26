import type { DividerProps } from "./Divider.types";

export default function Divider({
  text = "OR",
  className = "",
}: DividerProps) {
  return (
    <div
      className={`flex items-center gap-4 ${className}`}
    >
      <div className="h-px flex-1 bg-border" />

      <span className="text-sm font-medium text-textSecondary">
        {text}
      </span>

      <div className="h-px flex-1 bg-border" />
    </div>
  );
}