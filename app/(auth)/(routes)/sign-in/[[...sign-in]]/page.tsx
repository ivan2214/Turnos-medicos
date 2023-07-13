import prismadb from "@/lib/prismadb";
import { SignIn, currentUser, useUser } from "@clerk/nextjs";

export default async function Page() {
  const user = await currentUser();

  return (
    <div>
      <SignIn />
      <button>Save User Data</button>
    </div>
  );
}
