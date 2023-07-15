import React from "react";
import { TurnsFormWrapper } from "./components/TurnsFormWrapper";
import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";

const page = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/auth");
  const email = currentUser?.email;

  if (!email) {
    return redirect("/auth");
  }

  return (
    <div className="flex w-full items-center justify-center">
      <TurnsFormWrapper user={currentUser} />
    </div>
  );
};

export default page;
