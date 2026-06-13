import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

        <h1 className="mb-4 text-center text-3xl font-bold">
          Forgot Password
        </h1>

        <p className="mb-6 text-center text-gray-500">
          Enter your institutional email.
        </p>

        <form className="space-y-4">

          <input
            type="email"
            placeholder="user@uce.edu.ec"
            className="w-full rounded-lg border p-3"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 p-3 text-white"
          >
            Send Recovery Link
          </button>

        </form>

        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="text-blue-600 hover:underline"
          >
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}