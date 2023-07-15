import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/auth");
  }

  return <div>page</div>;
};

export default page;
