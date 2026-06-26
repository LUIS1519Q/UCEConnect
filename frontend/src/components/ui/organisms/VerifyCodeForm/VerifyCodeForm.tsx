import {
  Button,
  OTPInput,
  TimerText,
} from "../../atoms";

import type { VerifyCodeFormProps } from "./VerifyCodeForm.types";

export default function VerifyCodeForm({
  onSubmit,
}: VerifyCodeFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-textPrimary">
          Verification Code
        </label>

        <OTPInput />
      </div>

      <div className="text-center space-y-1">
        <p className="text-sm text-textSecondary">
          Didn't receive the code?
        </p>

        <TimerText
          time="00:30"
        />
      </div>

      <Button
        type="submit"
        className="w-full"
      >
        Verify Code
      </Button>
    </form>
  );
}