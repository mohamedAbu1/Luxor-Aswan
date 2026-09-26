import { supabase } from "@/lib/supabaseClient";
import { requireUser } from "@/lib/authGuard";
import { checkRateLimit, getClientKey, rateLimitResponse } from "@/lib/rateLimit";

export async function POST(req) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const rate = checkRateLimit(getClientKey(req, "message-create"), 30, 60_000);
  if (!rate.allowed) return rateLimitResponse(rate.retryAfter);

  const body = await req.json();
  const {
    user_id,
    content,
    sender_type,
    user_name,
    user_image,
    reply_to,
    admin_id,
    image_base64,
  } = body;

  const isAdmin = auth.user.user_metadata?.role === "ADMIN";
  if (!isAdmin && user_id !== auth.user.id) {
    return Response.json({ error: "You can only send messages for yourself" }, { status: 403 });
  }

  if (typeof image_base64 === "string" && image_base64.length > 5 * 1024 * 1024) {
    return Response.json({ error: "Image is too large" }, { status: 413 });
  }

  let imageUrl = null;

  if (image_base64) {
    const fileName = `${user_id}-${Date.now()}.png`;
    const fileBuffer = Buffer.from(image_base64, "base64");

    const { error: uploadError } = await supabase.storage
      .from("chat-images")
      .upload(fileName, fileBuffer, {
        contentType: "image/png",
        cacheControl: "31536000", // ✅ تخزين الصور سنة كاملة
      });

    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), {
        status: 400,
        headers: { "Cache-Control": "no-store" },
      });
    }

    const { data: publicUrlData } = supabase.storage
      .from("chat-images")
      .getPublicUrl(fileName);

    imageUrl = publicUrlData.publicUrl;
  }

  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        user_id,
        content: imageUrl || content,
        sender_type,
        user_name,
        user_image,
        reply_to,
        admin_id,
        status: "sent",
      },
    ])
    .select();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return new Response(JSON.stringify(data[0]), {
    status: 201,
    headers: { "Cache-Control": "no-store" }, // ✅ لا تخزن الرد
  });
}

// ✅ جلب الرسائل
export async function GET(req) {
  const auth = await requireUser();
  if (auth.response) return auth.response;

  const { searchParams } = new URL(req.url);
  const requestedUserId = searchParams.get("userId");
  const isAdmin = auth.user.user_metadata?.role === "ADMIN";
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 50, 1), 100);
  const offset = Math.max(Number(searchParams.get("offset")) || 0, 0);
  const userId = isAdmin ? requestedUserId : auth.user.id;

  let query = supabase
    .from("messages")
    .select("id, content, sender_type, created_at, user_name, user_image, reply_to, admin_id, status", { count: "exact" })
    .range(offset, offset + limit - 1);

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error, count } = await query.order("created_at", { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return new Response(JSON.stringify({ messages: data, pagination: { limit, offset, total: count ?? data.length } }), {
    status: 200,
    headers: { "Cache-Control": "no-cache" }, // ✅ اجلب أحدث نسخة دائمًا
  });
}

// ✅ تحديث حالة الرسالة
export async function PUT(req) {
  const auth = await requireUser();
  if (auth.response) return auth.response;

  const body = await req.json();
  const { messageId } = body;

  if (!messageId) {
    return Response.json({ error: "messageId required" }, { status: 400 });
  }

  const isAdmin = auth.user.user_metadata?.role === "ADMIN";
  if (!isAdmin) {
    const { data: message, error: messageError } = await supabase
      .from("messages")
      .select("user_id")
      .eq("id", messageId)
      .single();
    if (messageError || message?.user_id !== auth.user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const { data, error } = await supabase
    .from("messages")
    .update({ status: "seen" })
    .eq("id", messageId)
    .select();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Cache-Control": "no-store" },
    });
  }

  if (!data || data.length === 0) {
    return new Response(JSON.stringify({ error: "Message not found" }), {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return new Response(JSON.stringify(data[0] ?? {}), {
    status: 200,
    headers: { "Cache-Control": "no-store" }, // ✅ لا تخزن الرد
  });
}
