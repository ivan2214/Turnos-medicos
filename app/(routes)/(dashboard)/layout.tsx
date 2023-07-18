import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user?.admin) redirect("/needs-admin");
  return <div className="container overflow-hidden py-5">{children}</div>;
}
