// src/app/api/reviews/[id]/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { requireUser } from "@/lib/authGuard";

// ✅ GET: جلب تعليق واحد
export async function GET(req, { params }) {
  const { id: reviewId } = await params;

  const { data: review, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", reviewId)
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true, review });
}

// ✅ DELETE: حذف تعليق
export async function DELETE(req, { params }) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const user = auth.user;
  const { id: reviewId } = await params;

  const { data: review, error: fetchError } = await supabase
    .from("reviews")
    .select("id, user_id")
    .eq("id", reviewId)
    .single();

  if (fetchError || !review) {
    return NextResponse.json({ ok: false, error: "Review not found" }, { status: 404 });
  }

  if (user.user_metadata?.role !== "ADMIN" && user.id !== review.user_id) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
  if (error) {
    console.error("❌ Supabase error in DELETE:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, message: "Review deleted successfully" });
}

// ✅ PUT: تعديل تعليق
export async function PUT(req, { params }) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const user = auth.user;
  const { id: reviewId } = await params;
  const body = await req.json();

  const { comment, rating } = body;

  const { data: review, error: fetchError } = await supabase
    .from("reviews")
    .select("id, user_id")
    .eq("id", reviewId)
    .single();

  if (fetchError || !review) {
    return NextResponse.json({ ok: false, error: "Review not found" }, { status: 404 });
  }

  if (user.user_metadata?.role !== "ADMIN" && user.id !== review.user_id) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase
    .from("reviews")
    .update({ comment, rating })
    .eq("id", reviewId);

  if (error) {
    console.error("❌ Supabase error in PUT:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, message: "Review updated successfully" });
}
