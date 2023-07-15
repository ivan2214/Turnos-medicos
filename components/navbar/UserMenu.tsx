"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";
import { Button } from "../ui/button";
import { User as UserType } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface UserMenuProps {
  currentUser?: UserType | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const router = useRouter();

  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className=" h-8 w-8 rounded-full">
          {currentUser?.image?.length ? (
            <Avatar className="h-9 w-9">
              <AvatarImage src={currentUser?.image} />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-9 w-9">
              <AvatarImage src="/avatars/03.png" alt="@shadcn" />
              <AvatarFallback>AN</AvatarFallback>
            </Avatar>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {currentUser?.email && (
              <>
                <p className="text-sm font-medium leading-none">Email</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentUser.email}
                </p>
                <DropdownMenuSeparator />
              </>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuGroup>
          {currentUser ? (
            <>
              <DropdownMenuItem onClick={() => router.push("/appointments")}>
                Mis Turnos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                Log out
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={loginModal.onOpen}>
                Login
              </DropdownMenuItem>
              <DropdownMenuItem onClick={registerModal.onOpen}>
                Register
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
