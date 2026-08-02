import { and, desc, eq, sql } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { getDb } from "../../../db";
import { administrators, registrations } from "../../../db/schema";
import { getChatGPTUser } from "../../chatgpt-auth";
import { getGroupSession } from "../../group-auth";

const validGroups = new Set(["Atlanta", "Boston", "Florida", "Bến Tre", "Bình Dương", "Sài Gòn", "Phan Rang", "Quảng Ninh"]);

async function currentAdmin() {
  const groupSession = await getGroupSession();
  if (groupSession) {
    return {
      user: { userId: `group:${groupSession.username}`, email: groupSession.username, displayName: `Nhóm ${groupSession.groupName}`, fullName: null },
      admin: { id: 0, email: groupSession.username, role: "group" as const, groupName: groupSession.groupName, createdAt: "" },
      db: getDb(),
      authKind: "group" as const,
    };
  }
  const user = await getChatGPTUser();
  if (!user) return { error: Response.json({ error: "Vui lòng đăng nhập." }, { status: 401 }) };
  const db = getDb();
  let [admin] = await db.select().from(administrators).where(eq(administrators.email, user.email.toLowerCase())).limit(1);
  if (!admin) {
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(administrators);
    const configuredMaster = String((env as unknown as Record<string, unknown>).MASTER_EMAIL || "").trim().toLowerCase();
    if (!count && configuredMaster && user.email.toLowerCase() === configuredMaster) {
      [admin] = await db.insert(administrators).values({ email: user.email.toLowerCase(), role: "master", groupName: null, createdAt: new Date().toISOString() }).returning();
    }
  }
  if (!admin) return { error: Response.json({ error: "Tài khoản chưa được cấp quyền." }, { status: 403 }) };
  return { user, admin, db, authKind: "chatgpt" as const };
}

export async function GET() {
  const auth = await currentAdmin();
  if (auth.error) return auth.error;
  const { admin, db, user } = auth;
  const rows = admin.role === "master"
    ? await db.select().from(registrations).orderBy(desc(registrations.createdAt))
    : await db.select().from(registrations).where(eq(registrations.groupName, admin.groupName || "")).orderBy(desc(registrations.createdAt));
  const admins = admin.role === "master" ? await db.select().from(administrators).orderBy(administrators.email) : [];
  return Response.json({ user: { email: user.email, displayName: user.displayName }, admin, authKind: auth.authKind, registrations: rows, administrators: admins });
}

export async function POST(request: Request) {
  const auth = await currentAdmin();
  if (auth.error) return auth.error;
  if (auth.admin.role !== "master") return Response.json({ error: "Chỉ tài khoản tổng quản lý có quyền này." }, { status: 403 });
  const payload = await request.json() as { email?: string; groupName?: string };
  const email = payload.email?.trim().toLowerCase() || "";
  const groupName = payload.groupName?.trim() || "";
  if (!email.includes("@") || !validGroups.has(groupName)) return Response.json({ error: "Email hoặc nhóm không hợp lệ." }, { status: 400 });
  const [existing] = await auth.db.select().from(administrators).where(eq(administrators.email, email)).limit(1);
  if (existing?.role === "master") return Response.json({ error: "Không thể đổi tài khoản tổng quản lý thành quản lý nhóm." }, { status: 409 });
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
