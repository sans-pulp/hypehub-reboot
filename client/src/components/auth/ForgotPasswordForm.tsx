"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset } from "@/app/forgot-password/actions";

type ResetActionResponse = {
  success?: boolean;
  error?: string;
};

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("email", email);

      const result = await requestPasswordReset(formData) as ResetActionResponse;

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setSuccess(true);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Password reset request failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">
            Password reset instructions have been sent to your email. Please check your inbox.
          </p>
        </div>
        <Button asChild className="w-full">
          <Link href="/login">Return to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending..." : "Reset Password"}
      </Button>
      <div className="text-center text-sm mt-4">
        Remember your password?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </div>
    </form>
  );
};
