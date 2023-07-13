import { UserButton, currentUser } from "@clerk/nextjs";
import { ThemeToggle } from "./theme-toggle";
import { MainNavMobile } from "./main-nav-mobile";
import Link from "next/link";
import { Button } from "./ui/button";
import { MainNav } from "./main-nav";

const Navbar = async () => {
  const user = await currentUser();
  const admin = user?.publicMetadata?.admin ?? false;

  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-3 px-4 lg:gap-0">
        <MainNav admin={admin} className="mx-6 hidden lg:flex" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          {user && <UserButton afterSignOutUrl="/" />}
          {!user && (
            <Button>
              <Link href="/sign-in">Login</Link>
            </Button>
          )}
        </div>
        <MainNavMobile className="lg:hidden" />
      </div>
    </div>
  );
};

export default Navbar;
