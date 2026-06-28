import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ROUTES } from "../constants/routes";
import { useCountdown } from "./useCountdown";
import { authService } from "../api/authService";

import type { VerifyCodeFormData } from "../shemas/auth/verifyCodeSchema";

type Flow = "register" | "forgot-password";

interface Params {
  email: string;
  flow: Flow;
}

export function useVerifyCode({ email, flow }: Params) {
  const navigate = useNavigate();
  
  const [success, setSuccess] = useState("");

  // ---------------- TIMER ----------------
  const expiresTimer = useCountdown(300);

  const resendTimer = useCountdown(30);

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
        navigate(ROUTES.auth.login);
      } else {
        navigate(ROUTES.auth.resetPassword, {
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
      expiresTimer.reset();
      resendTimer.reset();

      setSuccess(
        flow === "register"
          ? "A new verification code has been sent."
          : "A new recovery code has been sent."
      );
    }
  });

  const onSubmit = (data: VerifyCodeFormData) => {
    setSuccess("");
    verifyMutation.mutate(data);
  };

  const onResend = useCallback(() => {
    resendMutation.mutate();
  }, [resendMutation]);

  return {
    onSubmit,
    isPending: verifyMutation.isPending,
    error: verifyMutation.error,

    expiresIn: expiresTimer.formattedTime,

    resendIn: resendTimer.formattedTime,

    canResend: resendTimer.seconds === 0,

    onResend,
    
    success,
  };
} 