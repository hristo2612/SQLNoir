import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAllCases, getLocalizedCase } from "@/lib/case-utils";
import { isCaseFree } from "@/lib/license";

export async function POST(req: NextRequest) {
  let body: { caseId?: string; answer?: string; locale?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { caseId, answer, locale = "en" } = body;

  if (!caseId || !answer) {
    return NextResponse.json(
      { error: "Missing caseId or answer" },
      { status: 400 }
    );
  }

  const caseData = getAllCases().find((c) => c.id === caseId);
  if (!caseData) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  // For non-free cases, verify the user has a license
  if (!isCaseFree(caseData)) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Invalid authentication" },
        { status: 401 }
      );
    }

    const { data: userInfo } = await supabaseAdmin
      .from("user_info")
      .select("has_license")
      .eq("id", user.id)
      .single();

    if (!userInfo?.has_license) {
      return NextResponse.json(
        { error: "License required" },
        { status: 403 }
      );
    }
  }

  const localizedCase = await getLocalizedCase(caseData, locale);

  const isCorrect =
    answer.trim().toLowerCase() ===
    localizedCase.solution.answer.toLowerCase();

  return NextResponse.json({
    correct: isCorrect,
    ...(isCorrect
      ? {
          explanation: localizedCase.solution.explanation,
          successMessage: localizedCase.solution.successMessage,
        }
      : {}),
  });
}
