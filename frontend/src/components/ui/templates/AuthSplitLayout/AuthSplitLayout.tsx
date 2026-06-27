import { Logo } from "../../atoms";

import type { AuthSplitLayoutProps } from "./AuthSplitLayout.types";

export default function AuthSplitLayout({
  title,
  description,
  children,
}: AuthSplitLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">

      <div className="flex flex-1 items-center justify-center bg-primary p-1">
        <div className="flex flex-col items-center text-center -translate-y-8">

          <Logo
            variant="vertical-white"
            className="w-80"
          />

          <p className="mt-2 max-w-xs text-center text-xl font-bold italic text-white">
            From your claim to the solution
          </p>

        </div>
      </div>

      <div className="flex justify-center bg-background px-12 pt-10 pb-8">

        <div className="w-full max-w-md space-y-4">

          <Logo
            variant="horizontal-color"
            className="w-80 mx-auto"
          />

          <div className="space-y-4">

            <h1 className="text-center text-3xl font-bold text-textPrimary">
              {title}
            </h1>

            <p className="text-center text-textSecondary">
              {description}
            </p>

          </div>

          {children}

        </div>

      </div>

    </div>
  );
}