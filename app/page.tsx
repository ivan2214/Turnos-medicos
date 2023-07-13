import Home from "@/components/home";
import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";

export default async function page() {
  const user = await currentUser();
  const fullName = user ? `${user?.firstName} ${user?.lastName}` : "";
  const email = user ? user?.emailAddresses[0]?.emailAddress : "";
  const image = user ? user?.imageUrl : "";

  const patient =
    user &&
    (await prismadb.patient.findUnique({
      where: {
        email: email,
      },
    }));

  return (
    <main className="flex  items-center justify-center px-10 py-5 lg:py-10">
      <Home email={email} fullName={fullName} image={image} patient={patient} />
    </main>
  );
}
