import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { AuthCenteredLayout } from "../../components/ui/templates";
import { VerifyCodeForm } from "../../components/ui/organisms";

import {
  verifyCodeSchema,
  type VerifyCodeFormData,
} from "../../shemas/auth/verifyCodeSchema";

import { useVerifyCode } from "../../hooks/useVerifyCode";

export default function VerifyCodePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { email = "", flow = "register" } =
    (location.state as {
      email?: string;
      flow?: "register" | "forgot-password";
    }) ?? {};

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema),
  });

  const {
    onSubmit,
    isPending,
    error,
    expiresIn,
    resendIn,
    canResend,
    onResend,
    success,
  } = useVerifyCode({ email, flow });

  useEffect(() => {
    if (!email) {
      navigate(flow === "register" ? "/register" : "/forgot-password");
    }
  }, [email, flow, navigate]);

  return (
    <AuthCenteredLayout
      title={
        flow === "register"
          ? "Verify Email"
          : "Verify Recovery Code"
      }
      description={
        flow === "register"
          ? `Enter the verification code sent to ${email}.`
          : `Enter the recovery code sent to ${email}.`
      }
    >
      <VerifyCodeForm
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        errors={errors}
        isPending={isPending}
        error={error instanceof Error ? error.message : ""}
        expiresIn={expiresIn}
        resendIn={resendIn}
        canResend={canResend}
        onResend={onResend}
        success={success}
      />
    </AuthCenteredLayout>
  );
}