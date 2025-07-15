import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import stripe from "@/lib/stripe";
import { subscriptionPlans } from "@/config/plans";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { planId } = body;

    if (!planId || !subscriptionPlans[planId]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const selectedPlan = subscriptionPlans[planId];

    // Only allow premium plans for checkout
    if (selectedPlan.type !== "PREMIUM") {
      return NextResponse.json(
        { error: "Invalid plan type for checkout" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (
      !selectedPlan.price ||
      !selectedPlan.currency ||
      !selectedPlan.interval
    ) {
      return NextResponse.json(
        { error: "Invalid plan configuration" },
        { status: 400 }
      );
    }

    // Ensure NEXT_PUBLIC_APP_URL is set and has https://
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const successUrl = `${baseUrl}/payment/success`;
    const cancelUrl = `${baseUrl}/pricing`;

    // Validate URLs
    if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
      throw new Error(
        "NEXT_PUBLIC_APP_URL must start with http:// or https://"
      );
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: selectedPlan.currency.toLowerCase(),
            product_data: {
              name: selectedPlan.name,
              description: selectedPlan.description,
            },
            unit_amount: Math.round(selectedPlan.price * 100), // Convert to cents and ensure it's an integer
            recurring: {
              interval: selectedPlan.interval,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment/failure?error=payment_cancelled`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id,
        planId: selectedPlan.id,
        planType: selectedPlan.type,
        billingInterval: selectedPlan.interval,
        userEmail: session.user.email,
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
          planId: selectedPlan.id,
          planType: selectedPlan.type,
          billingInterval: selectedPlan.interval,
          userEmail: session.user.email,
        },
      },
      // Customize the checkout page
      custom_text: {
        submit: {
          message: "You'll be charged monthly. You can cancel anytime.",
        },
      },
      billing_address_collection: "required",
      allow_promotion_codes: true,
      payment_method_options: {
        card: {
          request_three_d_secure: "automatic",
        },
      },
      // REMOVED payment_intent_data
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Error creating checkout session" },
      { status: 500 }
    );
  }
}
