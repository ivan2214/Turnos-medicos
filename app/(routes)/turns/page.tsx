import React from "react";
import { getPatient } from "@/actions/getPatient";
import { TurnsFormWrapper } from "./components/TurnsFormWrapper";
import getCurrentUser from "@/actions/getCurrentUser";
import EmptyState from "@/components/empty-state";
import { redirect } from "next/navigation";

const page = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/auth");
  const email = currentUser?.email;

  if (!email) {
    return redirect("/auth");
  }

  const patient = await getPatient(email);

  return (
    <div className="flex w-full items-center justify-center">
      <TurnsFormWrapper patient={patient} />
    </div>
  );
};

export default page;
