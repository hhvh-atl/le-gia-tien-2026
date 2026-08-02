import { getDb } from "../../../db";
import { registrations } from "../../../db/schema";

const groups = new Set(["Atlanta", "Boston", "Florida", "Bến Tre", "Bình Dương", "Sài Gòn", "Phan Rang", "Quảng Ninh"]);

export async function POST(request: Request) {
  try {
    const payload = await request.json() as Record<string, unknown>;
    const registrantName = String(payload.registrantName || "").trim();
    const deceasedName = String(payload.deceasedName || "").trim();
    const relationship = String(payload.relationship || "").trim();
    const groupName = String(payload.groupName || "").trim();
    const prayerYear = Number(payload.prayerYear);
    const notes = String(payload.notes || "").trim();
    if (!registrantName || !deceasedName || !relationship || !groups.has(groupName) || ![1, 2, 3, 4].includes(prayerYear)) {
      return Response.json({ error: "Xin kiểm tra lại các mục bắt buộc." }, { status: 400 });
    }
    const [registration] = await getDb().insert(registrations).values({ registrantName, deceasedName, relationship, groupName, prayerYear, notes, createdAt: new Date().toISOString() }).returning({ id: registrations.id });
    return Response.json({ registration }, { status: 201 });
  } catch {
    return Response.json({ error: "Không thể lưu đăng ký lúc này. Xin thử lại." }, { status: 500 });
  }
}
