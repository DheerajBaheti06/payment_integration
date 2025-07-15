import { headers } from "next/headers";
import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import prisma from "@/lib/db";

export async function POST(request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  const session = event.data.object;

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription
        );

        await prisma.subscription.upsert({
          where: { userId: session.metadata.userId },
          update: {
            status: "ACTIVE",
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer,
            endDate: new Date(subscription.current_period_end * 1000),
          },
          create: {
            userId: session.metadata.userId,
            plan: session.metadata.planType,
            status: "ACTIVE",
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer,
            endDate: new Date(subscription.current_period_end * 1000),
            billingInterval: session.metadata.billingInterval,
          },
        });
        break;
      }

      case "invoice.paid": {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription
        );

        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: "ACTIVE",
            endDate: new Date(subscription.current_period_end * 1000),
          },
        });
        break;
      }

      case "invoice.payment_failed": {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription
        );

        // Get the latest payment attempt
        const latestPaymentAttempt = await stripe.paymentIntents.retrieve(
          session.latest_charge
        );

        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: "PAST_DUE",
            metadata: {
              lastPaymentError:
                latestPaymentAttempt.last_payment_error?.message,
              lastPaymentErrorCode:
                latestPaymentAttempt.last_payment_error?.code,
              lastPaymentAttempt: new Date().toISOString(),
            },
          },
        });

        // Send notification to user about failed payment
        // You can implement email notification here
        break;
      }

      case "customer.subscription.deleted": {
        await prisma.subscription.update({
          where: { stripeSubscriptionId: session.id },
          data: {
            status: "CANCELLED",
            metadata: {
              cancellationReason:
                session.cancellation_reason || "user_cancelled",
              cancelledAt: new Date().toISOString(),
            },
          },
        });
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = await stripe.paymentIntents.retrieve(session.id);
        const subscription = await stripe.subscriptions.retrieve(
          paymentIntent.metadata.subscriptionId
        );

        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: "PAST_DUE",
            metadata: {
              lastPaymentError: paymentIntent.last_payment_error?.message,
              lastPaymentErrorCode: paymentIntent.last_payment_error?.code,
              lastPaymentAttempt: new Date().toISOString(),
            },
          },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}
