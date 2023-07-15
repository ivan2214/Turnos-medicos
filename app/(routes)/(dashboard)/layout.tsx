import getCurrentUser from "@/actions/getCurrentUser";
import Navbar from "@/components/navbar/navbar";
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
      <div className="container lg:py-3">{children}</div>
    </>
  );
}
