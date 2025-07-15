"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { signOut } from "next-auth/react";
import NewsSection from "@/components/news/NewsSection";
import NewsTabs from "@/components/news/NewsTabs";
import Pagination from "@/components/news/Pagination";
import { fetchIndianNews, fetchWorldNews } from "@/services/newsService";
import { Button } from "@/components/ui/button";
import { Home, LogOut, Sun, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useTheme } from "next-themes";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { getSubscriptionStatus } from "@/services/subscriptionService";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  const [indianNews, setIndianNews] = useState([]);
  const [worldNews, setWorldNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("indian");
  const [indianPage, setIndianPage] = useState(1);
  const [worldPage, setWorldPage] = useState(1);
  const [indianTotalPages, setIndianTotalPages] = useState(1);
  const [worldTotalPages, setWorldTotalPages] = useState(1);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const { toast } = useToast();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const checkSubscription = useCallback(async () => {
    try {
      const subStatus = await getSubscriptionStatus();
      setSubscription(subStatus);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check subscription status",
        variant: "destructive",
      });
    }
  }, [toast]);

  const hasActiveSubscription = useCallback(() => {
    return (
      subscription?.plan === "PREMIUM" &&
      subscription?.status === "ACTIVE" &&
      (!subscription?.endDate || new Date(subscription.endDate) > new Date())
    );
  }, [subscription]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      checkSubscription();
    }
  }, [session, checkSubscription]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "world" && !hasActiveSubscription()) {
      setShowSubscriptionDialog(true);
      setActiveTab("indian");
      router.replace("/dashboard?tab=indian", { scroll: false });
    } else if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams, router, hasActiveSubscription]);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const [indianData, worldData] = await Promise.all([
        fetchIndianNews(indianPage),
        fetchWorldNews(worldPage),
      ]);
      setIndianNews(indianData.articles);
      setWorldNews(worldData.articles);
      setIndianTotalPages(Math.ceil(indianData.totalResults / 7));
      setWorldTotalPages(Math.ceil(worldData.totalResults / 7));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch news",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [indianPage, worldPage, toast]);

  useEffect(() => {
    if (session) {
      fetchNews();
    }
  }, [session, fetchNews]);

  const handleTabChange = useCallback(
    (tab) => {
      if (tab === "world" && !hasActiveSubscription()) {
        setShowUpgradeDialog(true);
        return;
      }
      setActiveTab(tab);
      router.replace(`/dashboard?tab=${tab}`, { scroll: false });
    },
    [router, hasActiveSubscription]
  );

  const handleUpgradeClick = useCallback(() => {
    setShowUpgradeDialog(true);
  }, []);

  const handleUpgradeConfirm = useCallback(() => {
    setShowUpgradeDialog(false);
    router.push("/pricing");
  }, [router]);

  const handleSignOut = useCallback(() => {
    signOut({ callbackUrl: "/login" });
  }, []);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-black">
      <nav className="sticky top-0 z-50 border-b border-slate-200 shadow-lg dark:border-gray-800/80 dark:bg-gray-950 backdrop-blur-sm bg-slate-200/95 dark:bg-gray-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1
                onClick={() => router.push("/")}
                className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-indigo-700 bg-clip-text text-transparent cursor-pointer hover:from-orange-400 hover:to-indigo-600 transition-all duration-200 dark:from-blue-400 dark:to-blue-600 dark:hover:from-blue-500 dark:hover:to-indigo-700"
              >
                NewsHub
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-slate-800 dark:text-gray-200 font-semibold">
                Welcome,{" "}
                <span className="text-teal-700 font-bold dark:text-blue-400">
                  {session?.user?.name || "User"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-10 w-10 rounded-full hover:bg-teal-100/60 dark:hover:bg-gray-800"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-teal-600" />
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="h-10 px-4 rounded-full bg-slate-100 hover:bg-blue-100 text-indigo-800 hover:text-indigo-900 transition-all duration-200 border border-indigo-200 hover:border-indigo-300 shadow-sm hover:shadow-md dark:bg-blue-950 dark:hover:bg-blue-900 dark:text-blue-200 dark:hover:text-white dark:border-blue-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="my-8 text-center bg-slate-50 rounded-2xl p-8 shadow-md border border-blue-100 dark:bg-gray-900/90 dark:border-none">
          <h2 className="text-4xl font-bold text-indigo-700 dark:text-white mb-3">
            Welcome to Your News Dashboard
          </h2>
          <p className="text-slate-800 dark:text-gray-300 max-w-2xl mx-auto">
            Stay informed with the latest news from India and around the world
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 dark:bg-gray-950/90 dark:border-gray-800/80">
            <NewsTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              tabClassName="[&[data-state=active]]:border-b-4 [&[data-state=active]]:border-teal-500 [&[data-state=active]]:text-teal-800 [&[data-state=inactive]]:text-indigo-700"
            />
          </div>

          <div className="space-y-6">
            {activeTab === "indian" ? (
              <>
                <div className="bg-slate-50 rounded-2xl border-l-8 border-orange-200 border-blue-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 dark:bg-gray-950/90 dark:border-orange-600/80">
                  <NewsSection
                    title="Indian News"
                    news={indianNews}
                    isLoading={loading}
                    error={null}
                    viewMode="grid"
                    onViewModeChange={() => {}}
                  />
                </div>
                <div className="flex justify-center mt-8">
                  <Pagination
                    currentPage={indianPage}
                    totalPages={indianTotalPages}
                    onPageChange={setIndianPage}
                    className="bg-gradient-to-br from-slate-50 to-orange-50 rounded-2xl border border-orange-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200 dark:bg-gray-950/80 dark:border-orange-800/80"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="bg-slate-50 rounded-2xl border-l-8 border-teal-200 border-blue-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 dark:bg-gray-950/90 dark:border-teal-600/80">
                  <NewsSection
                    title="World News"
                    news={worldNews}
                    isLoading={loading}
                    error={null}
                    viewMode="grid"
                    onViewModeChange={() => {}}
                    isPremium={!hasActiveSubscription()}
                    onUpgradeClick={handleUpgradeClick}
                  />
                </div>
                <div className="flex justify-center mt-8">
                  <Pagination
                    currentPage={worldPage}
                    totalPages={worldTotalPages}
                    onPageChange={setWorldPage}
                    className="bg-gradient-to-br from-slate-50 to-teal-50 rounded-2xl border border-teal-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200 dark:bg-gray-950/80 dark:border-teal-800/80"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent className="bg-slate-50 dark:bg-gray-900 border border-teal-100 dark:border-gray-800 shadow-lg rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-teal-700 dark:text-white">
              Premium Content
            </AlertDialogTitle>
            <AlertDialogDescription className="text-teal-700 dark:text-gray-300">
              This content is only available to premium subscribers. Upgrade
              your account to access world news and more exclusive content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-50 dark:bg-gray-800 hover:bg-teal-50 dark:hover:bg-gray-700 text-teal-700 dark:text-gray-300 hover:text-teal-900 dark:hover:text-white border border-teal-100 dark:border-gray-700 hover:border-teal-200 dark:hover:border-gray-600 transition-colors">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUpgradeConfirm}
              className="bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 text-white shadow-sm hover:shadow-md transition-colors"
            >
              Upgrade Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster />
    </div>
  );
}
