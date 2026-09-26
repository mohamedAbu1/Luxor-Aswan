import { NextResponse } from "next/server";
import { requireUser } from "@/lib/authGuard";

export async function POST(request) {
  try {
    const auth = await requireUser();
    if (auth.response) return auth.response;

    const { amount, userDetails } = await request.json();
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!process.env.PAYMOB_API_KEY || !process.env.PAYMOB_INTEGRATION_ID) {
      console.error("❌ Missing Paymob Environment Variables");
      return NextResponse.json(
        { error: "Server configuration missing variables" },
        { status: 500 },
      );
    }

    // 1. Auth Request
    const authResponse = await fetch("https://accept.paymob.com/api/auth/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY }),
    });

    const authData = await authResponse.json();

    if (!authResponse.ok || !authData.token) {
      return NextResponse.json(
        { error: "Payment authentication failed" },
        { status: 401 },
      );
    }

    const authToken = authData.token;

    // 2. Order Registration
    const orderResponse = await fetch("https://accept.paymob.com/api/ecommerce/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: "false",
        amount_cents: amount * 100,
        currency: "EGP",
        items: [],
      }),
    });

    const orderData = await orderResponse.json();

    if (!orderResponse.ok || !orderData.id) {
      return NextResponse.json(
        { error: "Order registration failed" },
        { status: 400 },
      );
    }

    const orderId = orderData.id;

    // 3. Payment Key Request
    const paymentKeyResponse = await fetch("https://accept.paymob.com/api/acceptance/payment_keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: amount * 100,
        expiration: 3600,
        order_id: orderId,
        billing_data: {
          apartment: "NA",
          email: userDetails?.email || "customer@example.com",
          floor: "NA",
          first_name: userDetails?.firstName || "Guest",
          street: "NA",
          building: "NA",
          phone_number: userDetails?.phone || "+201000000000",
          shipping_method: "NA",
          postal_code: "NA",
          city: "Cairo",
          country: "EG",
          last_name: userDetails?.lastName || "User",
          state: "Cairo",
        },
        currency: "EGP",
        integration_id: Number(process.env.PAYMOB_INTEGRATION_ID),
        lock_order_when_paid: "true",
      }),
    });

    const paymentKeyData = await paymentKeyResponse.json();

    if (!paymentKeyResponse.ok || !paymentKeyData.token) {
      return NextResponse.json(
        { error: "Payment key generation failed" },
        { status: 400 },
      );
    }

    return NextResponse.json({ token: paymentKeyData.token });
  } catch (error) {
    console.error("💥 Paymob Server Error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 },
    );
  }
}
