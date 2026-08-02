"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Row = { id: number; registrantName: string; deceasedName: string; relationship: string; prayerYear: number; groupName: string; notes: string; createdAt: string };
type Admin = { id: number; email: string; role: "master" | "group"; groupName: string | null };
type Data = { user: { email: string; displayName: string }; admin: Admin; registrations: Row[]; administrators: Admin[] };
const groups = ["Atlanta", "Boston", "Florida", "Bến Tre", "Bình Dương", "Sài Gòn", "Phan Rang", "Quảng Ninh"];

export default function Dashboard() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"registrations" | "users">("registrations");
  const load = useCallback(async () => { const r = await fetch("/api/dashboard"); const j = await r.json(); if (!r.ok) setError(j.error); else setData(j); }, []);
  useEffect(() => { load(); }, [load]);
  const rows = useMemo(() => (data?.registrations || []).filter(row => (filter === "Tất cả" || row.groupName === filter) && `${row.registrantName} ${row.deceasedName} ${row.relationship}`.toLowerCase().includes(search.toLowerCase())), [data, filter, search]);
  async function addUser(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = event.currentTarget; const body = Object.fromEntries(new FormData(form)); const r = await fetch("/api/dashboard", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }); const j = await r.json(); if (!r.ok) setError(j.error); else { form.reset(); await load(); } }
  async function remove(email: string) { await fetch(`/api/dashboard?email=${encodeURIComponent(email)}`, { method: "DELETE" }); await load(); }
  function exportCsv() { const header = ["Tên thân hữu", "Tên thân nhân quá cố", "Mối quan hệ", "Năm thứ", "Nhóm", "Ghi chú", "Ngày gửi"]; const csv = [header, ...rows.map(r => [r.registrantName, r.deceasedName, r.relationship, r.prayerYear, r.groupName, r.notes, new Date(r.createdAt).toLocaleDateString("vi-VN")])].map(line => line.map(v => `"${String(v).replaceAll('"','""')}"`).join(",")).join("\n"); const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv" })); a.download = "danh-sach-cau-nguyen.csv"; a.click(); }
  if (error && !data) return <main className="dashboard-state"><h1>Không thể mở khu vực quản lý</h1><p>{error}</p><a href="/">Về trang đăng ký</a></main>;
  if (!data) return <main className="dashboard-state"><p>Đang tải danh sách…</p></main>;
  const isMaster = data.admin.role === "master";
  return <main className="dashboard-shell">
    <aside className="sidebar"><a className="brand light" href="/"><span className="brand-mark">AN</span><span><strong>Ân Nghĩa</strong><small>Quản lý 2026</small></span></a><nav><button className={tab === "registrations" ? "active" : ""} onClick={() => setTab("registrations")}>◫ <span>Danh sách ghi danh</span></button>{isMaster && <button className={tab === "users" ? "active" : ""} onClick={() => setTab("users")}>♙ <span>Người quản lý nhóm</span></button>}</nav><div className="account"><span>{data.user.displayName.slice(0, 1).toUpperCase()}</span><div><b>{data.user.displayName}</b><small>{isMaster ? "Tổng quản lý" : `Nhóm ${data.admin.groupName}`}</small></div></div><a className="signout" href="/signout-with-chatgpt?return_to=/">Đăng xuất</a></aside>
    <section className="dashboard-main">
      {tab === "registrations" ? <><div className="dash-heading"><div><p>{isMaster ? "Tất cả các nhóm" : `Nhóm ${data.admin.groupName}`}</p><h1>Danh sách ghi danh</h1></div><button onClick={exportCsv}>Tải file CSV ↓</button></div>
      <div className="stats"><article><span>Tổng ghi danh</span><b>{data.registrations.length}</b><small>Hồ sơ đã nhận</small></article><article><span>Số nhóm</span><b>{new Set(data.registrations.map(r => r.groupName)).size}</b><small>Đang có ghi danh</small></article><article><span>Mới nhất</span><b>{data.registrations[0] ? new Date(data.registrations[0].createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }) : "—"}</b><small>Ngày nhận gần nhất</small></article></div>
      <div className="table-card"><div className="table-tools"><input aria-label="Tìm kiếm" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tên…" />{isMaster && <select value={filter} onChange={e => setFilter(e.target.value)}><option>Tất cả</option>{groups.map(g => <option key={g}>{g}</option>)}</select>}<span>{rows.length} kết quả</span></div><div className="table-wrap"><table><thead><tr><th>Tên thân hữu</th><th>Thân nhân quá cố</th><th>Quan hệ</th><th>Năm</th><th>Nhóm</th><th>Ngày gửi</th></tr></thead><tbody>{rows.map(row => <tr key={row.id}><td><b>{row.registrantName}</b>{row.notes && <small>{row.notes}</small>}</td><td>{row.deceasedName}</td><td>{row.relationship}</td><td><span className="year">{row.prayerYear}</span></td><td><span className="group-pill">{row.groupName}</span></td><td>{new Date(row.createdAt).toLocaleDateString("vi-VN")}</td></tr>)}</tbody></table>{!rows.length && <p className="empty">Chưa có đăng ký phù hợp.</p>}</div></div></> : <><div className="dash-heading"><div><p>Phân quyền truy cập</p><h1>Người quản lý nhóm</h1></div></div><div className="user-grid"><form className="user-form" onSubmit={addUser}><h2>Thêm người quản lý</h2><p>Người này chỉ xem được dữ liệu của nhóm được giao.</p><label>Email tài khoản<input type="email" name="email" required placeholder="manager@example.com" /></label><label>Nhóm<select name="groupName" required defaultValue=""><option value="" disabled>Chọn nhóm</option>{groups.map(g => <option key={g}>{g}</option>)}</select></label><button>Thêm người quản lý</button></form><div className="admin-list"><h2>Tài khoản hiện có</h2>{data.administrators.map(a => <div key={a.email}><span>{a.email.slice(0,1).toUpperCase()}</span><p><b>{a.email}</b><small>{a.role === "master" ? "Tổng quản lý · tất cả nhóm" : `Nhóm ${a.groupName}`}</small></p>{a.role === "group" && <button onClick={() => remove(a.email)}>Xóa</button>}</div>)}</div></div></>}
    </section>
  </main>;
}
