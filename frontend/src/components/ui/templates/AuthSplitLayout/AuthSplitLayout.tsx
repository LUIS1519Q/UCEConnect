import { Logo } from "../../atoms";

import type { AuthSplitLayoutProps } from "./AuthSplitLayout.types";

export default function AuthSplitLayout({
  title,
  description,
  children,
}: AuthSplitLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-2">

      <div className="flex items-center justify-center bg-primary">
        <div className="flex h-96 w-96 items-center justify-center rounded-2xl bg-white/20 text-white">
          Institutional Illustration
        </div>
      </div>

      <div className="flex items-center justify-center bg-background p-12">

        <div className="w-full max-w-md space-y-8">

          <Logo
            variant="horizontal-color"
            className="h-14"
          />

          <div className="space-y-2">

            <h1 className="text-3xl font-bold text-textPrimary">
              {title}
            </h1>

            <p className="text-textSecondary">
              {description}
            </p>

          </div>

          {children}

        </div>

      </div>

    </div>
  );
}