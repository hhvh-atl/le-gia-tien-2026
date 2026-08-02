import { and, desc, eq, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { administrators, registrations } from "../../../db/schema";
import { getChatGPTUser } from "../../chatgpt-auth";

async function currentAdmin() {
  const user = await getChatGPTUser();
  if (!user) return { error: Response.json({ error: "Vui lòng đăng nhập." }, { status: 401 }) };
  const db = getDb();
  let [admin] = await db.select().from(administrators).where(eq(administrators.email, user.email.toLowerCase())).limit(1);
  if (!admin) {
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(administrators);
    if (!count) [admin] = await db.insert(administrators).values({ email: user.email.toLowerCase(), role: "master", groupName: null, createdAt: new Date().toISOString() }).returning();
  }
  if (!admin) return { error: Response.json({ error: "Tài khoản chưa được cấp quyền." }, { status: 403 }) };
  return { user, admin, db };
}

export async function GET() {
  const auth = await currentAdmin();
  if (auth.error) return auth.error;
  const { admin, db, user } = auth;
  const rows = admin.role === "master"
    ? await db.select().from(registrations).orderBy(desc(registrations.createdAt))
    : await db.select().from(registrations).where(eq(registrations.groupName, admin.groupName || "")).orderBy(desc(registrations.createdAt));
  const admins = admin.role === "master" ? await db.select().from(administrators).orderBy(administrators.email) : [];
  return Response.json({ user: { email: user.email, displayName: user.displayName }, admin, registrations: rows, administrators: admins });
}

export async function POST(request: Request) {
  const auth = await currentAdmin();
  if (auth.error) return auth.error;
  if (auth.admin.role !== "master") return Response.json({ error: "Chỉ tài khoản tổng quản lý có quyền này." }, { status: 403 });
  const payload = await request.json() as { email?: string; groupName?: string };
  const email = payload.email?.trim().toLowerCase() || "";
  const groupName = payload.groupName?.trim() || "";
  if (!email.includes("@") || !groupName) return Response.json({ error: "Email và nhóm là bắt buộc." }, { status: 400 });
  await auth.db.insert(administrators).values({ email, role: "group", groupName, createdAt: new Date().toISOString() }).onConflictDoUpdate({ target: administrators.email, set: { role: "group", groupName } });
  return Response.json({ ok: true }, { status: 201 });
}

export async function DELETE(request: Request) {
  const auth = await currentAdmin();
  if (auth.error) return auth.error;
  if (auth.admin.role !== "master") return Response.json({ error: "Không có quyền." }, { status: 403 });
  const email = new URL(request.url).searchParams.get("email")?.toLowerCase();
  if (!email) return Response.json({ error: "Thiếu email." }, { status: 400 });
  await auth.db.delete(administrators).where(and(eq(administrators.email, email), eq(administrators.role, "group")));
  return Response.json({ ok: true });
}
