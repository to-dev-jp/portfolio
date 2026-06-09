"use server";

import { ContactFormData } from "@/types/Types";

export async function handleEmailSubmit(
  data: ContactFormData,
): Promise<{ success: boolean; message: string }> {
  try {
    const apiBase = process.env.API_URL ?? "http://localhost:1323";
    const apiUrl = `${apiBase}/v1/api/email`;

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (res.ok) {
      return { success: true, message: "メール送信成功" };
    } else {
      return {
        success: false,
        message: responseData.message || "メール送信失敗",
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, message: errorMessage };
  }
}
