import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { authService } from "../api/authService";

import type { VerifyCodeFormData } from "../shemas/auth/verifyCodeSchema";

type Flow = "register" | "forgot-password";

interface Params {
  email: string;
  flow: Flow;
}

export function useVerifyCode({ email, flow }: Params) {
  const navigate = useNavigate();

  const [seconds, setSeconds] = useState(300);
  const [resendSeconds, setResendSeconds] = useState(30);
  const [success, setSuccess] = useState("");

  // ---------------- TIMER ----------------
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ---------------- VERIFY CODE ----------------
  const verifyMutation = useMutation({
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

  // ---------------- RESEND CODE ----------------
  const resendMutation = useMutation({
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
    verifyMutation.mutate(data);
  };

  return {
    onSubmit,
    isPending: verifyMutation.isPending,
    error: verifyMutation.error,

    expiresIn: `${Math.floor(seconds / 60)}:${(seconds % 60)
      .toString()
      .padStart(2, "0")}`,

    resendIn: `00:${resendSeconds
      .toString()
      .padStart(2, "0")}`,

    canResend: resendSeconds === 0,

    onResend: () => resendMutation.mutate(),

    success,
  };
}