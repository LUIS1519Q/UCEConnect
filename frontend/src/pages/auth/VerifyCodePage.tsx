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
  const {
    email = "",
    flow = "register",
  } = (location.state as {
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
  
  const [seconds, setSeconds] = useState(300);
  const [resendSeconds, setResendSeconds] = useState(30);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!email) {
      navigate(
        flow === "register"
          ? "/register"
          : "/forgot-password"
      );
    }
  }, [email, flow, navigate]);

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
    mutationFn: (data: VerifyCodeFormData) => {
      if (flow === "register") {
        return authService.verifyCode({
          email,
          code: data.code,
        });
      }

      return authService.verifyResetCode({
        email,
        code: data.code,
      });
    },

    onSuccess: (_, variables) => {
      if (flow === "register") {
        navigate("/login");
      } else {
        navigate("/reset-password", {
          state: {
            email,
            code: variables.code,
          },
        });
      }
    },
  });

  const { mutate: resendCode } = useMutation({
      mutationFn: () => {
        if (flow === "register") {
          return authService.resendCode(email);
        }

        return authService.resendResetCode(email);
      },

      onSuccess: () => {
        setSeconds(300);
        setResendSeconds(30);
        setSuccess(
          flow === "register"
            ? "A new verification code has been sent."
            : "A new recovery code has been sent."
        );
      },
    });

  const onSubmit = (data: VerifyCodeFormData) => {
    setSuccess("");
    mutate(data);
  };

  return (
    <AuthCenteredLayout
      title={
        flow === "register"
          ? "Verify Email"
          : "Verify Recovery Code"
      }
      description={
        flow === "register"
          ? `Enter the verification code sent to ${
              email || "your institutional email"
            }.`
          : `Enter the recovery code sent to ${
              email || "your institutional email"
            }.`
      }
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
        onResend={() => resendCode()}
        success={success}
      />
    </AuthCenteredLayout>
  );
}