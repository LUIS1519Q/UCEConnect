import { Logo } from "../../atoms";

import type { AuthSplitLayoutProps } from "./AuthSplitLayout.types";

export default function AuthSplitLayout({
  title,
  description,
  children,
}: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">

      <div className="hidden items-center justify-center bg-primary p-1 lg:flex">
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

      <div className="flex items-center justify-center bg-background px-4 py-6 lg:px-12 lg:pt-10 lg:pb-8">

        <div
          className="
            w-full
            max-w-md
            space-y-4

            rounded-2xl
            bg-surface
            p-6
            shadow-lg

            lg:rounded-none
            lg:bg-transparent
            lg:p-0
            lg:shadow-none
          "
        >

          <Logo
            variant="horizontal-color"
            className="mx-auto w-56 lg:w-80"
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