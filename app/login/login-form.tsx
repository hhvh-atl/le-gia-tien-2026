"use client";
import { FormEvent, useState } from "react";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/group-login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(values) });
    const result = await response.json() as { error?: string };
    if (!response.ok) { setError(result.error || "Không thể đăng nhập."); setLoading(false); return; }
    window.location.href = "/dashboard";
  }
  return <form className="login-form" onSubmit={submit}><label>Tên đăng nhập<input name="username" autoCapitalize="none" autoComplete="username" required placeholder="atlanta" /></label><label>Mật khẩu<input name="password" type="password" autoComplete="current-password" required placeholder="••••••••" /></label>{error && <p role="alert">{error}</p>}<button disabled={loading}>{loading ? "Đang đăng nhập…" : "Đăng nhập"}</button></form>;
}
