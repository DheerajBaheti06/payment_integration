"use client";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";
import { SignupForm } from "@/components/signup-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { handleSignup } from "@/app/actions/auth";
import { signIn } from "next-auth/react";
import { APP_CONFIG } from "@/config/app";

export default function SignupPage() {
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);
      const result = await handleSignup(formData);

      if (result.success) {
        // Redirect to login page after successful signup
        router.push(
          "/login?message=Account created successfully. Please login."
        );
      } else {
        setError(result.error || "Something went wrong!");
      }
    } catch (error) {
      setError(error.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Error</AlertDialogTitle>
              <AlertDialogDescription>{error}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setError(null)}>
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 self-center font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <div className="bg-blue-600 text-white dark:bg-blue-500 flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            {APP_CONFIG.name}
          </Link>

          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Create an account
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter your information to create your account
            </p>
          </div>

          <SignupForm onSubmit={onSubmit} isLoading={loading} />

          
        </div>
      </div>
    </>
  );
}
