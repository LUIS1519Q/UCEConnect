import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

import logo from "../../assets/uceconnect-logo.png";
import { useAuth } from "../../hooks/useAuth";
import { loginSchema, type LoginFormData } from "./loginSchema";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const { login, isPending, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left Section */}
      <div className="hidden md:flex flex-col items-center justify-center bg-blue-600 p-10 text-white">
        <img
          src={logo}
          alt="UCEConnect"
          className="mb-8 w-72"
        />

        <h1 className="mb-4 text-5xl font-bold">
          UCEConnect
        </h1>

        <p className="text-center text-xl">
          From your claim to the solution
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
          <div className="mb-6 flex justify-center">
            <img
              src={logo}
              alt="UCEConnect"
              className="h-16"
            />
          </div>

          <h2 className="mb-2 text-center text-3xl font-bold">
            Welcome
          </h2>

          <p className="mb-8 text-center text-gray-500">
            Sign in to continue
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div>
              <input
                type="email"
                placeholder="name@uce.edu.ec"
                {...register("email")}
                className="w-full rounded-lg border p-3"
              />

              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password")}
                  className="w-full rounded-lg border p-3 pr-16"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-blue-600 p-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? "Signing In..." : "Sign In"}
            </button>

            {error && (
              <p className="text-center text-sm text-red-500">
                Login failed. Please try again.
              </p>
            )}
            
            <div className="mt-4 text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="mt-3 text-center">
              <span className="text-gray-600">
                Don't have an account?{" "}
              </span>

              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:underline"
              >
                Create Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;