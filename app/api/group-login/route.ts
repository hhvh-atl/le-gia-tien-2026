import { clearGroupSession, createGroupSession, groupCredentials } from "../../group-auth";

export async function POST(request: Request) {
  const payload = await request.json() as { username?: string; password?: string };
  const username = payload.username?.trim().toLowerCase() || "";
  const password = payload.password || "";
  if (!groupCredentials[username] || password !== username) {
    return Response.json({ error: "Tên đăng nhập hoặc mật khẩu không đúng." }, { status: 401 });
  }
  await createGroupSession(username);
  return Response.json({ ok: true });
}

export async function DELETE() {
  await clearGroupSession();
  return Response.json({ ok: true });
}
