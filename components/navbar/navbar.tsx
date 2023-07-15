import { ThemeToggle } from "../theme-toggle";
import { MainNavMobile } from "./main-nav-mobile";
import Link from "next/link";
import { Button } from "../ui/button";
import { MainNav } from "./main-nav";
import { SafeUser } from "@/types";
import UserMenu from "./UserMenu";
import { User } from "@prisma/client";
import { Search } from "@/app/(root)/components/search";

interface NavbarProps {
  currentUser?: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  const admin = currentUser?.admin ?? false;

  return (
    <div className="border-b container">
      <div className="flex h-16 items-center gap-3 px-4 lg:gap-0">
        <MainNav admin={admin} className="mx-6 hidden lg:flex" />
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <ThemeToggle />
          <UserMenu currentUser={currentUser} />
        </div>
        <MainNavMobile className="lg:hidden" />
      </div>
    </div>
  );
};

export default Navbar;
