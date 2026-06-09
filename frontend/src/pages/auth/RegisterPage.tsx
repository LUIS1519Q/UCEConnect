import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import {
  registerSchema,
  type RegisterFormData,
} from "./registerSchema";

export default function RegisterPage() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const navigate = useNavigate();

  const onSubmit = (data: RegisterFormData) => {
    console.log(data);

    navigate("/verify-email");

  };

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
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            Create Account
          </button>
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