import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { subscriptionPlans } from "@/config/plans";

// GET /api/subscription - Get user's subscription status
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database using email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({
      subscription: subscription || null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching subscription" },
      { status: 500 }
    );
  }
}

// POST /api/subscription - Create or update subscription
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      plan,
      status,
      endDate,
      stripeSubscriptionId,
      stripeCustomerId,
      billingInterval,
    } = await request.json();

    const subscription = await prisma.subscription.upsert({
      where: { userId: session.user.id },
      update: {
        plan,
        status,
        endDate: new Date(endDate),
        stripeSubscriptionId,
        stripeCustomerId,
        billingInterval,
      },
      create: {
        userId: session.user.id,
        plan,
        status,
        endDate: new Date(endDate),
        stripeSubscriptionId,
        stripeCustomerId,
        billingInterval,
      },
    });

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "Error updating subscription" },
      { status: 500 }
    );
  }
}
