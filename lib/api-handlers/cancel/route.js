import { requireUser } from "@/lib/authGuard";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  const auth = await requireUser();
  if (auth.response) return auth.response;


  const { tripId } = await req.json();
  const userId = auth.user.id;

  // ✅ تحديث حالة الحجز إلى Cancelled
  const { error } = await supabase
    .from("purchases")
    .update({ status: "Cancelled" })
    .eq("trip_id", tripId)
    .eq("user_id", userId);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
