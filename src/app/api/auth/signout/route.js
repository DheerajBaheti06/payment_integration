import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = cookies();

    // Clear all auth-related cookies
    cookieStore.getAll().forEach((cookie) => {
      if (
        cookie.name.startsWith("next-auth") ||
        cookie.name === "token" ||
        cookie.name === "session"
      ) {
        cookieStore.delete(cookie.name);
      }
    });

    // Set expired cookies to ensure they're removed from the browser
    const response = NextResponse.json({ success: true }, { status: 200 });

    // Add Set-Cookie headers to clear cookies
    response.cookies.set({
      name: "next-auth.session-token",
      value: "",
      expires: new Date(0),
      path: "/",
    });

    response.cookies.set({
      name: "next-auth.csrf-token",
      value: "",
      expires: new Date(0),
      path: "/",
    });

    response.cookies.set({
      name: "next-auth.callback-url",
      value: "",
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error during signout:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
