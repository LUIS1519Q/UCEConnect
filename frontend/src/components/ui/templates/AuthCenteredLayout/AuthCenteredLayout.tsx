import { Logo } from "../../atoms";

import type { AuthCenteredLayoutProps } from "./AuthCenteredLayout.types";

export default function AuthCenteredLayout({
  title,
  description,
  children,
}: AuthCenteredLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-8">

      <div className="w-full max-w-lg">

        <div className="rounded-2xl bg-surface p-10 shadow-lg">

          <Logo
            variant="horizontal-color"
            className="mx-auto w-80"
          />

          <div className="mt-6 space-y-3">

            <h1 className="text-center text-3xl font-bold text-textPrimary">
              {title}
            </h1>

            <p className="text-center text-textSecondary">
              {description}
            </p>

          </div>

          <div className="mt-8">
            {children}
          </div>

        </div>

      </div>

    </div>
  );
}