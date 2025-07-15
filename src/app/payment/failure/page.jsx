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
import { XCircle, AlertTriangle, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PaymentFailurePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [errorDetails, setErrorDetails] = useState(null);

  useEffect(() => {
    const error = searchParams.get("error");
    const errorCode = searchParams.get("error_code");
    const errorMessage = searchParams.get("error_message");

    if (error || errorCode || errorMessage) {
      setErrorDetails({
        error,
        errorCode,
        errorMessage,
      });
    }
  }, [searchParams]);

  const getErrorMessage = () => {
    if (errorDetails?.errorMessage) {
      return errorDetails.errorMessage;
    }

    switch (errorDetails?.errorCode) {
      case "card_declined":
        return "Your card was declined. Please try a different card or contact your bank.";
      case "insufficient_funds":
        return "Your card has insufficient funds. Please try a different card or add funds to your account.";
      case "expired_card":
        return "Your card has expired. Please update your card information.";
      case "incorrect_number":
        return "The card number is incorrect. Please check and try again.";
      case "incorrect_cvc":
        return "The security code (CVC) is incorrect. Please check and try again.";
      case "processing_error":
        return "There was an error processing your card. Please try again.";
      default:
        return "There was an error processing your payment. Please try again or contact support.";
    }
  };

  const getErrorIcon = () => {
    switch (errorDetails?.errorCode) {
      case "card_declined":
      case "insufficient_funds":
        return <CreditCard className="h-16 w-16 text-red-500 animate-pulse" />;
      case "expired_card":
      case "incorrect_number":
      case "incorrect_cvc":
        return (
          <AlertTriangle className="h-16 w-16 text-yellow-500 animate-pulse" />
        );
      default:
        return <XCircle className="h-16 w-16 text-red-500 animate-pulse" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">{getErrorIcon()}</div>
          <CardTitle className="text-2xl text-white">Payment Failed</CardTitle>
          <CardDescription className="text-gray-400">
            We couldn't process your payment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-800/50 p-6 rounded-lg space-y-3 border border-gray-700/50">
            <h3 className="font-semibold text-white">Error Details</h3>
            <p className="text-gray-400">{getErrorMessage()}</p>
            {errorDetails?.errorCode && (
              <p className="text-sm text-gray-500">
                Error Code: {errorDetails.errorCode}
              </p>
            )}
          </div>

          <div className="text-center space-y-4">
            <p className="text-gray-400">
              Please try again with a different payment method or contact our
              support team for assistance.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => router.push("/pricing")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/support")}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
