import { Controller } from "react-hook-form";

import {
  Button,
  TimerText,
  Link,
} from "../../atoms";

import {
  OTPInput,
} from "../../molecules";

import type { VerifyCodeFormProps } from "./VerifyCodeForm.types";

export default function VerifyCodeForm({
  onSubmit,
  control,
  errors,
  isPending,
  error,
  success,
  expiresIn,
  resendIn,
  canResend,
  onResend,
}: VerifyCodeFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4"
    > 
      <Controller
        name="code"
        control={control}
        render={({ field }) => (
          <OTPInput
            value={
              field.value
                ? field.value.split("")
                : Array(6).fill("")
            }
            onChange={(value) =>
              field.onChange(value.join(""))
            }
          />
        )}
      />

      {errors.code && (
        <p className="text-center text-sm text-red-500">
          {errors.code.message}
        </p>
      )}
    
      <TimerText
        label="Code expires in"
        time={expiresIn ?? "05:00"}
      />

      <div className="text-center text-sm">

        <span className="text-textSecondary">
          Didn't receive the code?{" "}
        </span>

        {canResend ? (
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={onResend}
          >
            Resend Code
          </Button>
        ) : (
          <span className="text-textSecondary">
            Resend in{" "}
            <span className="font-semibold text-primary">
              {resendIn ?? "00:30"}
            </span>
          </span>
        )}

        {success && (
          <p className="mt-2 text-center text-sm text-green-600">
            {success}
          </p>
        )}

      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
      >
        {isPending
          ? "Verifying..."
          : "Verify Code"}
      </Button>

      {error && (
        <p className="text-center text-sm text-red-500">
          {error}
        </p>
      )}

      <div className="text-center">
        <Link href="/login">
          Back to Login
        </Link>
      </div>
    </form>
  );
}