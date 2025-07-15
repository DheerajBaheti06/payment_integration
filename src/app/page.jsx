"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { APP_CONFIG } from "@/config/app";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status, session]);

  if (isLoading) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return <>
    <nav className="sticky top-0 z-50 border-b border-slate-200 shadow-lg dark:border-gray-800/80 dark:bg-gray-950 backdrop-blur-sm bg-slate-200/95 dark:bg-gray-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1
                onClick={() => (window.location.href = "/")}
                className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-indigo-700 bg-clip-text text-transparent cursor-pointer hover:from-orange-400 hover:to-indigo-600 transition-all duration-200 dark:from-blue-400 dark:to-blue-600 dark:hover:from-blue-500 dark:hover:to-indigo-700"
              >
                {APP_CONFIG.name}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-10 w-10 rounded-full hover:bg-teal-100/60 dark:hover:bg-gray-800"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-teal-600" />
                )}
              </Button>
              {session ? (
                <Link
                  href="/dashboard"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 border transition-colors border-gray-300 text-gray-700 rounded-md hover:border-blue-600 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:text-blue-400"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ml-2"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-black flex justify-center align-middle ">
      

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="my-8 text-center bg-slate-50 rounded-2xl p-8 shadow-md border border-blue-100 dark:bg-gray-900/90 dark:border-none">
          <h2 className="text-4xl font-bold text-indigo-700 dark:text-white mb-3">
            Welcome to {APP_CONFIG.name}
          </h2>
          <p className="text-slate-800 dark:text-gray-300 max-w-2xl mx-auto">
            Stay informed with the latest news and updates. Sign up to access
            more features!
          </p>
        </div>
        <div className="space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Link
                href="/signup"
                className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-lg"
              >
                Get Started
              </Link>
              <Link
                href="/pricing"
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:border-blue-600 hover:text-blue-600 transition-colors text-lg dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:text-blue-400"
              >
                View Pricing
              </Link>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-2xl border-l-8 border-orange-200 border-blue-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 dark:bg-gray-950/90 dark:border-orange-600/80">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-blue-600 text-xl">📰</span>
                <h3 className="text-lg font-semibold">Latest Updates</h3>
              </div>
              <p className="text-gray-600">
                Stay informed about the latest features, security patches, and
                improvements to our platform.
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl border-l-8 border-teal-200 border-blue-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 dark:bg-gray-950/90 dark:border-teal-600/80">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-blue-600 text-xl">🔔</span>
                <h3 className="text-lg font-semibold">
                  Real-time Notifications
                </h3>
              </div>
              <p className="text-gray-600">
                Receive instant notifications about important updates and
                changes that affect your integration.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </>
}
