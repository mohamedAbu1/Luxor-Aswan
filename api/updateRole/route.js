import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { requireAdmin } from "@/lib/authGuard";


export async function POST(req) {
  try {
    const auth = await requireAdmin();
    if (auth.response) return auth.response;

    const { userId, newRole } = await req.json();
    if (!userId || !["USER", "ADMIN"].includes(newRole)) {
      return NextResponse.json({ error: "Invalid role update" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { role: newRole },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, role: newRole }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
