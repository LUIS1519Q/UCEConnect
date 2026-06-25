import { Logo } from "../../atoms";
import type { AuthScreenProps } from "./AuthScreen.types";

export default function AuthScreen({
  title,
  subtitle,
  logoVariant = "horizontal-color",
  children,
}: AuthScreenProps) {
  return (
    <div className="min-h-screen bg-background">

      <div className="mx-auto flex min-h-screen max-w-7xl">

        {/* Left Side */}
        <section className="hidden w-1/2 lg:flex items-center justify-center">

          <Logo
            variant={logoVariant}
            className="h-20"
          />

        </section>

        {/* Right Side */}
        <section className="flex w-full items-center justify-center lg:w-1/2">

          <div className="w-full max-w-md">

            <h1 className="text-3xl font-bold text-textPrimary">
              {title}
            </h1>

            <p className="mt-2 text-textSecondary">
              {subtitle}
            </p>

            <div className="mt-8">
              {children}
            </div>

          </div>

        </section>

      </div>

    </div>
  );
}