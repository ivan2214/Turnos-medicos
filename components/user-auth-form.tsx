"use client";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useLoginModal, useRegisterModal } from "@/hooks";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  currentUser?: User | null;
}

export function UserAuthForm({
  currentUser,
  className,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  useEffect(() => {
    if (currentUser) redirect("/");
  }, [currentUser]);

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="grid gap-2">
        <Button onClick={() => loginModal.onOpen()} disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or Register now
          </span>
        </div>
      </div>
      <Button
        onClick={() => registerModal.onOpen()}
        variant="outline"
        type="button"
        disabled={isLoading}
      >
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Register
      </Button>
    </div>
  );
}
