import { ThemeProvider } from "@/providers/theme-provider";
import NeedAdmin from "./components/need-admin";
import Heading from "@/components/ui/heading";
import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";

const NeedAdminPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return redirect("/auth");
  }

  return (
    <section className="flex h-screen items-center justify-center">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="flex h-full flex-col items-center justify-center gap-10">
          <Heading title="Necesitas ser admin" />
          <NeedAdmin currentUser={currentUser} />
        </div>
      </ThemeProvider>
    </section>
  );
};

export default NeedAdminPage;
