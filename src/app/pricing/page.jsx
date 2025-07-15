"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { subscriptionPlans } from "@/config/plans";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

// Initialize Stripe outside of the component
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [loadingPlans, setLoadingPlans] = useState({});
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [userSubscription, setUserSubscription] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router, session]);

  // Fetch user's current subscription
  useEffect(() => {
    const fetchUserSubscription = async () => {
      try {
        const response = await axios.get("/api/user-subscription");
        if (response.data?.subscription) {
          setUserSubscription(response.data.subscription);
        }
      } catch (error) {
        // Error handled by UI toast, no log needed
      }
    };

    if (session?.user) {
      fetchUserSubscription();
    }
  }, [session]);

  const handleSubscribe = async (plan) => {
    if (plan.type === "PREMIUM") {
      try {
        setIsPageLoading(true);
        setLoadingPlans((prev) => ({ ...prev, [plan.id]: true }));

        // Create a checkout session
        const response = await axios.post("/api/create-checkout-session", {
          planId: plan.id,
        });

        if (!response.data?.sessionId) {
          throw new Error("No session ID received from server");
        }

        // Get Stripe instance
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error("Failed to load Stripe");
        }

        // Redirect to Stripe Checkout
        const { error } = await stripe.redirectToCheckout({
          sessionId: response.data.sessionId,
        });

        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.details ||
          error.response?.data?.error ||
          error.message ||
          "Failed to process subscription. Please try again.";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsPageLoading(false);
        setLoadingPlans((prev) => ({ ...prev, [plan.id]: false }));
      }
    }
  };

  const handleBack = () => {
    router.push("/dashboard");
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-black">
      <Button
        variant="ghost"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 ml-5 mt-7 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800/50"
        onClick={handleBack}
        disabled={isPageLoading}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <Toaster />
      <div className="w-full flex items-center justify-center">
        <div className="container max-w-7xl px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Choose Your Plan
            </h1>
            <p className="text-gray-600 text-base max-w-2xl mx-auto dark:text-gray-400">
              Select the perfect plan for your news reading needs. Upgrade to
              Premium for unlimited access to all news categories.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-4 md:px-8">
            {Object.values(subscriptionPlans).map((plan) => {
              const isCurrentPlan = userSubscription?.planId === plan.id;
              const isDisabled =
                isPageLoading || isCurrentPlan || plan.disabled;

              return (
                <Card
                  key={plan.id}
                  className={`flex flex-col transition-all duration-300 hover:shadow-xl ${
                    plan.type === "PREMIUM"
                      ? "bg-white border-blue-200 shadow-xl scale-105 dark:bg-blue-950/30 dark:border-blue-800/50"
                      : "bg-white border-gray-200 hover:scale-105 dark:bg-gray-900/50 dark:border-gray-800/50"
                  } ${isPageLoading ? "opacity-75" : ""} p-1`}
                >
                  <CardHeader className="space-y-3 pb-6">
                    <CardTitle className="text-xl text-gray-900 dark:text-white">
                      {plan.name}
                    </CardTitle>
                    <div>
                      <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {plan.currency === "INR" ? "₹" : "$"}
                        {plan.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        /{plan.interval}
                      </span>
                    </div>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                      {plan.description}
                    </CardDescription>
                    {isCurrentPlan && (
                      <div className="text-sm text-green-600 dark:text-green-500 font-medium">
                        Current Plan
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="flex-grow py-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0 dark:text-blue-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Button
                      variant={plan.buttonVariant}
                      className={`w-full h-10 text-sm ${
                        plan.type === "PREMIUM"
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md dark:bg-blue-950 dark:hover:bg-blue-900 dark:text-blue-200 dark:hover:text-white dark:border-blue-800"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white dark:border-gray-700"
                      }`}
                      onClick={() => handleSubscribe(plan)}
                      disabled={isDisabled}
                    >
                      {loadingPlans[plan.id]
                        ? "Processing..."
                        : isCurrentPlan
                        ? "Current Plan"
                        : plan.buttonText}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
