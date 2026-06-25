import type { TimerTextProps } from "./TimerText.types";

export default function TimerText({
  time,
  label = "Resend code in",
}: TimerTextProps) {
  return (
    <p className="text-sm text-textSecondary">
      {label}{" "}
      <span className="font-semibold text-primary">
        {time}
      </span>
    </p>
  );
}