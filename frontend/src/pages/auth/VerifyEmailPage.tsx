import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../../api/authService";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email ?? "";
  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(300);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) =>
        prev > 0 ? prev - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => authService.verifyCode({ email, code }),
    onSuccess: () => navigate("/login"),
  });

  const { mutate: resendCode, isPending: isResending } =
    useMutation({
      mutationFn: () =>
        authService.resendCode(email),

      onSuccess: () => {
        setSeconds(300);
        alert(
          "Verification code resent successfully."
        );
      },
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

        <h1 className="mb-4 text-center text-3xl font-bold">
          Verify Email
        </h1>

        <p className="mb-6 text-center text-gray-500">
          Enter the verification code sent to{" "}
          <span className="font-medium text-gray-700">{email || "your institutional email"}</span>.
        </p>

        <p className="mb-4 text-center text-sm text-red-500">
          Code expires in:{" "}
          {Math.floor(seconds / 60)}:
          {(seconds % 60)
            .toString()
            .padStart(2, "0")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            className="w-full rounded-lg border p-3 tracking-widest text-center text-lg"
          />

          <button
            type="submit"
            disabled={isPending || code.length !== 6}
            className="w-full rounded-lg bg-blue-600 p-3 text-white disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? "Verifying..." : "Verify Account"}
          </button>

          <button
            type="button"
            onClick={() => resendCode()}
            disabled={isResending}
            className="w-full rounded-lg border border-blue-600 p-3 text-blue-600 disabled:opacity-70"
          >
            {isResending
              ? "Resending..."
              : "Resend Code"}
          </button>

          {error && (
            <p className="text-center text-sm text-red-500">
              {(error as any)?.response?.data?.message ?? "Invalid or expired code."}
            </p>
          )}
        </form>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}