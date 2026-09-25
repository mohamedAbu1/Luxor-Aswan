import { NextResponse } from "next/server";
import { requireUser } from "@/lib/authGuard";
import { supabase } from "@/lib/supabaseClient";
import { checkRateLimit, getClientKey, rateLimitResponse } from "@/lib/rateLimit";

export async function POST(req) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const rate = checkRateLimit(getClientKey(req, "review-like"), 30, 60_000);
  if (!rate.allowed) return rateLimitResponse(rate.retryAfter);

  // قراءة البيانات من الـ body
  const body = await req.json();
  const { reviewId } = body;
  const user_id = auth.user.id;



  if (!reviewId || !user_id ) {
    return NextResponse.json({ ok: false, error: "Missing reviewId, user_id or trip_id" }, { status: 400 });
  }

  const { error: insertError } = await supabase
    .from("review_likes")
    .insert([{ review_id: reviewId, user_id, created_at: new Date().toISOString()}]);

  if (insertError) {
    console.error("❌ Supabase error (POST):", insertError.message);
    return NextResponse.json({ ok: false, error: insertError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, message: "Like added successfully" });
}


// 🔴 إزالة لايك
export async function DELETE(req) {
  const auth = await requireUser();
  if (auth.response) return auth.response;

  const body = await req.json();
  const { reviewId } = body;
  const user_id = auth.user.id;



  if (!reviewId || !user_id ) {
    return NextResponse.json({ ok: false, error: "Missing reviewId, user_id or trip_id" }, { status: 400 });
  }

  const { error: deleteError } = await supabase
    .from("review_likes")
    .delete()
    .eq("review_id", reviewId)
    .eq("user_id", user_id)

  if (deleteError) {
    console.error("❌ Supabase error (DELETE):", deleteError.message);
    return NextResponse.json({ ok: false, error: deleteError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, message: "Like removed successfully" });
}


// 📊 جلب عدد اللايكات
export async function GET(req, { params }) {
  const { id: reviewId } = await params;
  if (!reviewId) {
    return NextResponse.json({ ok: false, error: "Missing reviewId" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("review_likes")
    .select("user_id")
    .eq("review_id", reviewId);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    count: data?.length || 0,
  });
}
