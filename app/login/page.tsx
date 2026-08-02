import LoginForm from "./login-form";

export default function LoginPage() {
  return <main className="login-shell"><section className="login-card"><a className="brand login-brand" href="/"><img className="brand-logo" src="/logo.png" alt="Hội Huyền Vi Học" /><span><strong>Hội Huyền Vi Học</strong><small>Lễ Gia Tiên 2026</small></span></a><div className="login-copy"><p>Khu vực quản lý</p><h1>Đăng nhập nhóm</h1><span>Dùng tên nhóm viết liền, không dấu, bằng chữ thường.</span></div><LoginForm /><div className="master-login"><span>Tổng quản lý?</span><a href="/signin-with-chatgpt?return_to=/dashboard">Đăng nhập bằng ChatGPT →</a></div></section></main>;
}
