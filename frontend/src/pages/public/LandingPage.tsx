import { useNavigate } from "react-router-dom";

import { Logo } from "../../components/ui/atoms/Logo";
import { Button } from "../../components/ui/atoms/Button";

import { ROUTES } from "../../constants/routes";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">

      {/* Navbar */}

      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">

          <Logo
            variant="horizontal-slogan-color"
            className="w-44"
          />

          <div className="flex gap-4">

            <Button
              variant="ghost"
              onClick={() =>
                navigate(ROUTES.auth.login)
              }
            >
              Login
            </Button>

            <Button
              onClick={() =>
                navigate(ROUTES.auth.register)
              }
            >
              Register
            </Button>

          </div>

        </div>
      </header>

      {/* Hero */}

      <main className="mx-auto flex max-w-7xl flex-col items-center px-8 py-28 text-center">

        <h1 className="mb-6 text-5xl font-bold text-textPrimary">
          Report university incidents easily
        </h1>

        <p className="mb-10 max-w-2xl text-lg text-textSecondary">
          UCEConnect allows students to create, monitor and manage
          incidents reported inside the university.
        </p>

        <Button
          size="lg"
          onClick={() =>
            navigate(ROUTES.auth.login)
          }
        >
          Get Started
        </Button>

      </main>

      {/* Footer */}

      <footer className="border-t border-border py-8 text-center text-sm text-textSecondary">
        © 2026 UCEConnect
      </footer>

    </div>
  );
}