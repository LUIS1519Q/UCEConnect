import { useMicrosoftCallback } from "../../hooks/useMicrosoftCallback";

export default function MicrosoftCallbackPage() {
  useMicrosoftCallback();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Signing in with Microsoft...</p>
    </div>
  );
}