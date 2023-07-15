"use client";

import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const NeedAdmin = ({ currentUser }: { currentUser: User }) => {
  useEffect(() => {
    if (currentUser.admin) return redirect("/");
  }, [currentUser]);

  const handleClick = () => {
    console.log("click");

    signOut();
    redirect("/");
  };

  return (
    <Button size="lg"  onClick={handleClick}>
      Salir
    </Button>
  );
};

export default NeedAdmin;
