import { getChatGPTUser } from "../chatgpt-auth";
import { getGroupSession } from "../group-auth";
import { redirect } from "next/navigation";
import Dashboard from "./dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!(await getChatGPTUser()) && !(await getGroupSession())) redirect("/login");
  return <Dashboard />;
}
