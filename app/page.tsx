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
          <img className="brand-logo" src="/logo.png" alt="Hội Huyền Vi Học" />
          <span><strong>Lễ Gia Tiên 2026</strong></span>
        </a>
        <a className="admin-link" href="/dashboard">Khu vực quản lý <span>→</span></a>
      </header>

      <section className="hero">
        <div className="eyebrow"><span /> Đăng ký đang mở</div>
        <h1>Ghi danh người thân<br/><em>và dâng lời cầu nguyện cho Lễ Gia Tiên 2026.</em></h1>
        <p>Xin điền thông tin bên dưới. Mỗi đăng ký sẽ được gửi đến đúng nhóm phụ trách để chuẩn bị danh sách cầu nguyện.</p>
      </section>

      <RegistrationForm />

      <footer>
        <p>Thông tin của quý vị chỉ được chia sẻ với người quản lý của nhóm đã chọn.</p>
        <a href="/dashboard">Dành cho người quản lý</a>
      </footer>
    </main>
  );
}
