import type { LoadingStateProps } from "./LoadingState.types";

export default function LoadingState({
  title = "Loading...",
}: LoadingStateProps) {
  return (
    <div className="flex min-h-[320px] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />

        <p className="text-sm text-textSecondary">
          {title}
        </p>
      </div>
    </div>
  );
}