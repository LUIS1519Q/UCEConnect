import { Logo } from "../../atoms";

import type { AuthCenteredLayoutProps } from "./AuthCenteredLayout.types";

export default function AuthCenteredLayout({
  title,
  description,
  children,
}: AuthCenteredLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-6 sm:px-6 md:px-8 lg:px-12">

      <div className="w-full max-w-md lg:max-w-lg">

        <div
            className="
                rounded-2xl
                bg-surface
                p-6
                shadow-lg

                sm:p-8
                lg:p-10
            "
        >

          <Logo
            variant="horizontal-color"
            className="mx-auto w-56 sm:w-64 lg:w-80"
          />

          <div className="mt-6 space-y-4">

            <h1 className="text-center text-2xl lg:text-3xl font-bold text-textPrimary">
              {title}
            </h1>

            <p className="text-center text-textSecondary">
              {description}
            </p>

          </div>

          <div className="mt-6 lg:mt-8">
            {children}
          </div>

        </div>

      </div>

    </div>
  );
}