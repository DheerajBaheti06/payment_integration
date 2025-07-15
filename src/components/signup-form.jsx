"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

export function SignupForm({ className, onSubmit, isLoading, ...props }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-900/50 hover:shadow-xl dark:hover:shadow-gray-900/70 transition-shadow duration-300">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 mt-4">
            {isLoading ? "Processing..." : "Create your account"}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
            {isLoading ? "" : "Join us today and start your journey"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-4">
                <div className="grid gap-2 group">
                  <Label
                    htmlFor="name"
                    className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.username}
                    onChange={handleChange}
                    className="border-2 border-gray-200 dark:border-gray-800 focus:border-blue-500 dark:focus:border-blue-400 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300"
                  />
                </div>
                <div className="grid gap-2 group">
                  <Label
                    htmlFor="email"
                    className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@gmail.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="border-2 border-gray-200 dark:border-gray-800 focus:border-blue-500 dark:focus:border-blue-400 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300"
                  />
                </div>
                <div className="grid gap-2 group">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="border-2 border-gray-200 dark:border-gray-800 focus:border-blue-500 dark:focus:border-blue-400 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 hover:scale-[1.02] transition-all duration-300"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </div>
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-all duration-300"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-center text-xs text-gray-500 dark:text-gray-400">
        By creating an account, you agree to our{" "}
        <Link
          href="/terms"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300"
        >
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
