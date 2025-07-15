"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { APP_CONFIG } from "@/config/app";

export default function LoginPage() {
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      setSuccessMessage(message);
    }
    // Handle NextAuth error query param
    const errorParam = searchParams.get("error");
    if (errorParam) {
      let errorMsg = "An error occurred. Please try again.";
      if (errorParam === "AccessDenied") {
        errorMsg =
          "Access denied. Please use an allowed account or contact support.";
      } else if (errorParam === "OAuthAccountNotLinked") {
        errorMsg =
          "This email is already registered. Please sign in with the provider you used originally.";
      } else if (errorParam === "Configuration") {
        errorMsg = "There is a configuration error. Please contact support.";
      } else if (errorParam === "Callback") {
        errorMsg = "There was a problem during sign in. Please try again.";
      }
      setError(errorMsg);
    }
  }, [searchParams]);

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setError(error.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      setError("Failed to sign in with Google. Please try again.");
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
      {successMessage && (
        <AlertDialog
          open={!!successMessage}
          onOpenChange={() => setSuccessMessage(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Success</AlertDialogTitle>
              <AlertDialogDescription>{successMessage}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setSuccessMessage(null)}>
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r dark:border-gray-800">
          <div className="absolute inset-0 bg-zinc-900 dark:bg-gray-950" />
          <Link
            href="/"
            className="relative z-20 flex items-center text-lg font-medium hover:text-blue-400 transition-colors"
          >
            <GalleryVerticalEnd className="mr-2 h-6 w-6" />
            {APP_CONFIG.name}
          </Link>
          <div className="relative z-20 mt-auto">
          </div>
        </div>
        <div className="p-4 lg:p-8 h-full flex items-center">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                Welcome back
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enter your credentials to sign in to your account
              </p>
            </div>
            <LoginForm onSubmit={handleSubmit} isLoading={loading} />
          </div>
        </div>
      </div>
    </>
  );
}
