import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { registerSchema, type RegisterFormData } from "./registerSchema";
import { authService } from "../../api/authService";

export default function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: RegisterFormData) =>
      authService.register({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        role: "student",
      }),
    onSuccess: (_, variables) => {
      navigate("/verify-email", { state: { email: variables.email } });
    },
  });

  const onSubmit = (data: RegisterFormData) => mutate(data);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h1>

        <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        >

            <div>
            <label className="block mb-1 font-medium">
                First Name
            </label>

            <input
            type="text"
            placeholder="John"
            {...register("firstName")}
            className="w-full border rounded-lg p-3"
            />

            {errors.firstName && (
            <p className="text-sm text-red-500">
                {errors.firstName.message}
            </p>
            )}
            </div>

            <div>
            <label className="block mb-1 font-medium">
                Last Name
            </label>

            <input
            type="text"
            placeholder="Doe"
            {...register("lastName")}
            className="w-full border rounded-lg p-3"
            />

            {errors.lastName && (
            <p className="text-sm text-red-500">
                {errors.lastName.message}
            </p>
            )}
            </div>

          <div>
            <label className="block mb-1 font-medium">
              Institutional Email
            </label>

            <input
            type="email"
            placeholder="user@uce.edu.ec"
            {...register("email")}
            className="w-full border rounded-lg p-3"
            />

            {errors.email && (
            <p className="text-sm text-red-500">
                {errors.email.message}
            </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Password
            </label>

            <input
            type="password"
            placeholder="********"
            {...register("password")}
            className="w-full border rounded-lg p-3"
            />

            {errors.password && (
            <p className="text-sm text-red-500">
                {errors.password.message}
            </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Confirm Password
            </label>

            <input
            type="password"
            placeholder="********"
            {...register("confirmPassword")}
            className="w-full border rounded-lg p-3"
            />

            {errors.confirmPassword && (
            <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
            </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? "Creating Account..." : "Create Account"}
          </button>

          {error && (
            <p className="text-center text-sm text-red-500">
              {(error as any)?.response?.data?.message ?? "Registration failed. Please try again."}
            </p>
          )}
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold"
          >
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}