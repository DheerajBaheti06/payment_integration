// Payment verification handler
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import stripe from "@/lib/stripe";
import prisma from "@/lib/db";

export async function POST(request) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      console.error("Invalid user session:", { session });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.error("User not found in database:", {
        email: session.user.email,
      });
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get session ID
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Get Stripe session
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "customer", "line_items"],
    });

    if (!checkoutSession) {
      console.error("No checkout session found");
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }

    // Verify customer
    const customerEmail =
      checkoutSession.customer?.email ||
      checkoutSession.customer_details?.email ||
      checkoutSession.metadata?.userEmail;

    if (!customerEmail) {
      console.error("No customer email found in session");
      return NextResponse.json(
        { error: "Invalid session data" },
        { status: 400 }
      );
    }

    if (customerEmail !== session.user.email) {
      console.error("Email mismatch:", {
        sessionEmail: session.user.email,
        customerEmail,
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check payment status
    if (checkoutSession.payment_status !== "paid") {
      console.error("Payment not completed:", {
        status: checkoutSession.status,
        payment_status: checkoutSession.payment_status,
      });
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Get subscription
    let subscription;
    if (checkoutSession.subscription) {
      const subscriptionId =
        typeof checkoutSession.subscription === "string"
          ? checkoutSession.subscription
          : checkoutSession.subscription.id;

      subscription = await stripe.subscriptions.retrieve(subscriptionId);
    } else {
      console.error("No subscription found in session");
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 400 }
      );
    }

    // Set dates and plan details
    const endDate = new Date(subscription.current_period_end * 1000);
    const planType = checkoutSession.metadata?.planType || "PREMIUM";
    const billingInterval =
      checkoutSession.metadata?.billingInterval || "month";

    try {
      // Update subscription
      const updatedSubscription = await prisma.subscription.upsert({
        where: { userId: user.id },
        update: {
          plan: planType,
          status: "ACTIVE",
          endDate,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer,
          billingInterval,
        },
        create: {
          userId: user.id,
          plan: planType,
          status: "ACTIVE",
          endDate,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer,
          billingInterval,
        },
      });

      return NextResponse.json({
        success: true,
        subscription: {
          plan: updatedSubscription.plan,
          status: updatedSubscription.status,
          billingInterval: updatedSubscription.billingInterval,
          endDate: updatedSubscription.endDate,
        },
      });
    } catch (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Error updating subscription in database" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error verifying payment:", {
      message: error.message,
      type: error.type,
      code: error.code,
    });

    return NextResponse.json(
      {
        error: "Error verifying payment",
        details: error.message,
        type: error.type,
        code: error.code,
      },
      { status: 500 }
    );
  }
}
