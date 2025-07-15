"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [status, setStatus] = useState("loading");
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setStatus("error");
        return;
      }

      try {
        const response = await fetch("/api/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus("success");
          setSubscriptionDetails(data.subscription);
        } else {
          setStatus("error");
          toast({
            title: "Error",
            description: data.error || "Failed to verify payment",
            variant: "destructive",
          });
        }
      } catch (error) {
        setStatus("error");
        toast({
          title: "Error",
          description: "Failed to verify payment. Please try again.",
          variant: "destructive",
        });
      }
    };

    verifyPayment();
  }, [sessionId, toast]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">
              Verifying Payment
            </CardTitle>
            <CardDescription className="text-gray-400">
              Please wait while we verify your payment...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
            <p className="text-gray-400">This may take a few moments...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-red-500 animate-pulse" />
            </div>
            <CardTitle className="text-2xl text-white">Payment Error</CardTitle>
            <CardDescription className="text-gray-400">
              There was an error processing your payment.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <p className="text-gray-400 text-center">
              We couldn't verify your payment. Please try again or contact
              support if the issue persists.
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/pricing")}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Back to Pricing
              </Button>
              <Button
                onClick={() => router.push("/support")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 animate-bounce" />
          </div>
          <CardTitle className="text-2xl text-white">
            Payment Successful!
          </CardTitle>
          <CardDescription className="text-gray-400">
            Thank you for your subscription.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {subscriptionDetails && (
            <div className="bg-gray-800/50 p-6 rounded-lg space-y-3 border border-gray-700/50">
              <h3 className="font-semibold text-white">Subscription Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <span className="text-gray-400">Plan:</span>
                <span className="font-medium text-white">
                  {subscriptionDetails.plan}
                </span>
                <span className="text-gray-400">Status:</span>
                <span className="font-medium text-green-400">
                  {subscriptionDetails.status}
                </span>
                <span className="text-gray-400">Billing Interval:</span>
                <span className="font-medium text-white">
                  {subscriptionDetails.billingInterval}
                </span>
                <span className="text-gray-400">Next Billing Date:</span>
                <span className="font-medium text-white">
                  {new Date(subscriptionDetails.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
          <div className="text-center space-y-4">
            <p className="text-gray-400">
              Your payment has been processed successfully. You now have access
              to all premium features.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => router.push("/dashboard")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
