"use client";
import { trpc } from "@/utils/trpc";
import React, { useEffect } from "react";

type Props = {
  patient: any;
  image: string;
  email: string;
  fullName: string;
};

const Home = ({ patient, email, fullName }: Props) => {
  const createPatientMutation = trpc.createPatient.useMutation();

  useEffect(() => {
    if (fullName !== "" && email !== "" && !patient) {
      createPatientMutation.mutate(
        {
          email,
          fullName,
        },
        {
          onSuccess(data, variables, context) {
            console.log(data);
            console.log(variables);
            console.log(context);
          },
        },
      );
    }
  }, []);

  return <div>home</div>;
};

export default Home;
