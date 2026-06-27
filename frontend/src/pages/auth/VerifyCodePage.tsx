import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../../api/authService";

import { AuthCenteredLayout } from "../../components/ui/templates";
import { VerifyCodeForm } from "../../components/ui/organisms";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  verifyCodeSchema,
  type VerifyCodeFormData,
} from "./verifyCodeSchema";

export default function VerifyCodePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email ?? "";

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema),
  });
  
  const [seconds, setSeconds] = useState(300);
  const [resendSeconds, setResendSeconds] = useState(30);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) =>
        prev > 0 ? prev - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendSeconds((prev) =>
        prev > 0 ? prev - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: VerifyCodeFormData) => authService.verifyCode({ email, code: data.code, }),
    onSuccess: () => navigate("/login"),
  });

  const { mutate: resendCode } = useMutation({
      mutationFn: () =>
        authService.resendCode(email),

      onSuccess: () => {
        setSeconds(300);
        setResendSeconds(30);
        setSuccess("A new verification code has been sent.");
      },
    });

  const onSubmit = (data: VerifyCodeFormData) => { mutate(data);};

  return (
    <AuthCenteredLayout
      title="Verify Email"
      description={`Enter the verification code sent to ${email || "your institutional email"}.`}
    >
      <VerifyCodeForm
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        errors={errors}
        isPending={isPending}
        error={
          error instanceof Error
            ? error.message
            : ""
        }
        expiresIn={`${Math.floor(seconds / 60)}:${(seconds % 60)
          .toString()
          .padStart(2, "0")}`}
        resendIn={`00:${resendSeconds
          .toString()
          .padStart(2, "0")}`}
        canResend={resendSeconds === 0}
        onResend={() => {
          console.log("Resend presionado");
          resendCode();
        }}
        success={success}
      />
    </AuthCenteredLayout>
  );
}