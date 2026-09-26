import { NextResponse } from "next/server";
import { requireUser } from "@/lib/authGuard";
import { supabase } from "@/lib/supabaseClient";
import { checkRateLimit, getClientKey, rateLimitResponse } from "@/lib/rateLimit";


export async function GET(req) {
  console.log("➡️ GET /api/reviews called");
  const { searchParams } = new URL(req.url);
  const tripId = searchParams.get("tripId");
  console.log("📥 tripId param:", tripId);

  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 20, 1), 100);
  const offset = Math.max(Number(searchParams.get("offset")) || 0, 0);
  let query = supabase
    .from("reviews")
    .select("id, trip_id, user_id, rating, comment, name, avatar_url, time, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (tripId) {
    console.log("➡️ Filtering reviews by tripId:", tripId);
    query = query.eq("trip_id", tripId);
  }

  const { data, error, count } = await query;
  console.log("📥 Supabase query result:", data, error);

  if (error) {
    console.error("❌ Supabase error in GET /api/reviews:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  console.log("✅ Reviews fetched successfully:", data.length);
  return NextResponse.json({ success: true, reviews: data, pagination: { limit, offset, total: count ?? data.length } }, { status: 200 });
}

// ✅ إضافة تعليق جديد
export async function POST(req) {
  try {
    const rate = checkRateLimit(getClientKey(req, "review-create"), 10, 60_000);
    if (!rate.allowed) return rateLimitResponse(rate.retryAfter);

    const auth = await requireUser();
    if (auth.response) return auth.response;

    const body = await req.json();

    const { trip_id, rating, comment, name, avatar_url, time } = body;
    const user_id = auth.user.id;

    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          trip_id,
          user_id,
          rating,
          comment,
          name,
          avatar_url,
          time,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
    }

    console.log("✅ Supabase insert success:", data);
    return new Response(JSON.stringify({ success: true, review: data[0] }), { status: 201 });
  } catch (err) {
    console.error("❌ API Error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
