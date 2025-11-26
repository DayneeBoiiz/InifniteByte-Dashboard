"use client";

import { SignUp } from "@clerk/nextjs";
import { Building2 } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600/20 rounded-2xl">
              <Building2 className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome</h2>
          <p className="text-gray-400 mt-2">
            Sign up to your account to continue
          </p>
        </div>

        {/* Clerk SignUp Component */}
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
            },
          }}
          path="/sign-up"
          routing="path"
        />

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
