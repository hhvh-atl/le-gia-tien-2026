import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og.png`;
  return {
    title: { default: "Ân Nghĩa — Gia Tiên 2026", template: "%s — Ân Nghĩa" },
    description: "Hệ thống đăng ký và quản lý danh sách cầu nguyện gia tiên.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: { title: "Đăng Ký Cầu Nguyện Gia Tiên 2026", description: "Ghi danh người thân trong lời cầu nguyện.", images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: "Đăng Ký Cầu Nguyện Gia Tiên 2026", description: "Ghi danh người thân trong lời cầu nguyện.", images: [image] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
