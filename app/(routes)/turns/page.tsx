import React from "react";
import { TurnsForm } from "./components/turns-form";
import { getPatient } from "@/actions/getPatient";
import { currentUser, useUser } from "@clerk/nextjs";
import { TurnsFormWrapper } from "./components/TurnsFormWrapper";

const page = async () => {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress || "";
  const patient = (await getPatient(email)) || undefined;
  return (
    <div className="flex w-full items-center justify-center">
      <TurnsFormWrapper patient={patient} />
    </div>
  );
};

export default page;
