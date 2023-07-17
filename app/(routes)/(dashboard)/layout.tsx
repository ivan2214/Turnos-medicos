import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user?.admin) redirect("/needs-admin");
  return (
    <>
      <div className="overflow-x-hidden lg:py-3">{children}</div>
    </>
  );
}
