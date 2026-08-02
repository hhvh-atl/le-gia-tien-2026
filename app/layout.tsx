import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/logo.png`;
  return {
    title: { default: "Hội Huyền Vi Học — Gia Tiên 2026", template: "%s — Hội Huyền Vi Học" },
    description: "Hệ thống đăng ký và quản lý danh sách cầu nguyện gia tiên.",
    icons: { icon: "/logo.png", shortcut: "/logo.png" },
    openGraph: { title: "Đăng Ký Cầu Nguyện Gia Tiên 2026", description: "Ghi danh người thân trong lời cầu nguyện.", images: [{ url: image, width: 370, height: 367 }] },
    twitter: { card: "summary", title: "Đăng Ký Cầu Nguyện Gia Tiên 2026", description: "Ghi danh người thân trong lời cầu nguyện.", images: [image] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
