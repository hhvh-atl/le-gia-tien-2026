import type { Metadata } from "next";
import RegistrationForm from "./registration-form";

export const metadata: Metadata = {
  title: "Đăng Ký Cầu Nguyện Gia Tiên 2026",
  description: "Gửi thông tin cầu nguyện cho thân nhân quá cố.",
};

export default function Home() {
  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Trang chủ">
          <span className="brand-mark">AN</span>
          <span><strong>Ân Nghĩa</strong><small>Gia Tiên 2026</small></span>
        </a>
        <a className="admin-link" href="/dashboard">Khu vực quản lý <span>→</span></a>
      </header>

      <section className="hero">
        <div className="eyebrow"><span /> Đăng ký đang mở</div>
        <h1>Ghi danh người thân<br/><em>trong lời cầu nguyện.</em></h1>
        <p>Xin điền thông tin bên dưới. Mỗi đăng ký sẽ được gửi đến đúng nhóm phụ trách để chuẩn bị danh sách cầu nguyện.</p>
        <div className="hero-meta">
          <div><b>08</b><span>Nhóm phụ trách</span></div>
          <div><b>01–04</b><span>Năm cầu nguyện</span></div>
          <div><b>2 phút</b><span>Thời gian điền</span></div>
        </div>
      </section>

      <RegistrationForm />

      <footer>
        <p>Thông tin của quý vị chỉ được chia sẻ với người quản lý của nhóm đã chọn.</p>
        <a href="/dashboard">Dành cho người quản lý</a>
      </footer>
    </main>
  );
}
