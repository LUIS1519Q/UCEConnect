import { AUTH_TEXT } from "../../../../constants/authText";

import type { TimerTextProps } from "./TimerText.types";

export default function TimerText({
  time,
  label = AUTH_TEXT.resendCodeIn,
}: TimerTextProps) {
  return (
    <p className="text-center text-sm text-textSecondary">
      {label}{" "}
      <span className="font-semibold text-primary">
        {time}
      </span>
    </p>
  );
}