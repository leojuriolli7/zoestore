import { ADMIN_KEY_COOKIE_NAME } from "@/lib/adminKey";
import { A_YEAR } from "@/lib/time";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (typeof password !== "string") {
    return NextResponse.json(
      { success: false, message: "Requisição inválida" },
      { status: 400 }
    );
  }

  if (password === process.env.ADMIN_KEY) {
    const cookieStore = await cookies();

    cookieStore.set({
      name: ADMIN_KEY_COOKIE_NAME,
      expires: Date.now() + A_YEAR,
      value: password,
      sameSite: "none",
      secure: true,
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { success: false, message: "Não autorizado." },
    { status: 401 }
  );
}
