import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/auth");
  return <div className="container overflow-hidden py-5">{children}</div>;
}
