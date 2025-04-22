import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full nes-container with-title max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 title">Reset Password</h1>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
