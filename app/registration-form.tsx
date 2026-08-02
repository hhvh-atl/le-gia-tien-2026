"use client";

import { FormEvent, useState } from "react";

const groups = ["Atlanta", "Boston", "Florida", "Bến Tre", "Bình Dương", "Sài Gòn", "Phan Rang", "Quảng Ninh"];

export default function RegistrationForm() {
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("saving");
    setMessage("");
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/registrations", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Không thể gửi đăng ký.");
      form.reset();
      setStatus("done");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Có lỗi xảy ra.");
      setStatus("error");
    }
  }

  return (
    <section className="form-card" aria-labelledby="form-title">
      <div className="form-intro">
        <span className="step">01</span>
        <div><p>Phiếu ghi danh</p><h2 id="form-title">Thông tin cầu nguyện</h2></div>
      </div>
      {status === "done" ? (
        <div className="success" role="status">
          <div className="success-icon">✓</div>
          <h2>Đã nhận thông tin</h2>
          <p>Cảm ơn quý vị. Đăng ký đã được chuyển đến nhóm phụ trách.</p>
          <button onClick={() => setStatus("idle")}>Gửi thêm một đăng ký</button>
        </div>
      ) : (
        <form onSubmit={submit}>
          <div className="field-grid">
            <label><span>Tên thân hữu <b>*</b></span><input name="registrantName" required autoComplete="name" placeholder="Nguyễn Văn An" /></label>
            <label><span>Tên thân nhân quá cố <b>*</b></span><input name="deceasedName" required placeholder="Nguyễn Văn Bình" /></label>
            <label><span>Mối quan hệ với người quá cố <b>*</b></span><input name="relationship" required placeholder="Cha, mẹ, ông, bà…" /></label>
            <label><span>Cầu nguyện năm thứ <b>*</b></span><select name="prayerYear" required defaultValue=""><option value="" disabled>Chọn năm</option><option value="1">Năm thứ 1</option><option value="2">Năm thứ 2</option><option value="3">Năm thứ 3</option><option value="4">Năm thứ 4</option></select></label>
            <label className="full"><span>Quý vị thuộc nhóm nào? <b>*</b></span><select name="groupName" required defaultValue=""><option value="" disabled>Chọn nhóm phụ trách</option>{groups.map(group => <option key={group}>{group}</option>)}</select><small>Người quản lý nhóm này sẽ có thể xem đăng ký của quý vị.</small></label>
            <label className="full"><span>Ghi chú <i>(không bắt buộc)</i></span><textarea name="notes" rows={3} placeholder="Thông tin thêm quý vị muốn chia sẻ…" /></label>
          </div>
          {status === "error" && <p className="form-error" role="alert">{message}</p>}
          <div className="submit-row"><p><span>🔒</span> Thông tin được lưu an toàn</p><button disabled={status === "saving"}>{status === "saving" ? "Đang gửi…" : "Gửi đăng ký"}<span>→</span></button></div>
        </form>
      )}
    </section>
  );
}
