"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface Route {
  href: string;
  label: string;
  active: boolean;
}

interface MainNavProps {
  admin: boolean;
  className?: string;
}

export const MainNav: React.FC<MainNavProps> = ({
  className,
  admin,
  ...props
}) => {
  const pathname = usePathname();

  const routes: Route[] = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/appointments",
      label: "Gestionar Turnos",
      active: pathname === "/appointments",
    },
    {
      href: "/times",
      label: "Gestionar Horarios",
      active: pathname === "/times",
    },
    {
      href: "/days",
      label: "Gestionar Dias",
      active: pathname === "/days",
    },
    {
      href: "/patients",
      label: "Gestionar Pacientes",
      active: pathname === "/patients",
    },
    {
      href: "/users",
      label: "Gestionar Usuarios",
      active: pathname === "/users",
    },
  ];

  return (
    <nav className={cn("flex items-center gap-5", className)} {...props}>
      {!admin &&
        routes.map((route) => {
          const condition = !route.href.startsWith("/dashboard");

          return (
            <>
              {condition && !admin && (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    route.active
                      ? "text-black dark:text-white"
                      : "text-muted-foreground",
                  )}
                >
                  {route.label}
                </Link>
              )}
            </>
          );
        })}

      {admin &&
        routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              route.active
                ? "text-black dark:text-white"
                : "text-muted-foreground",
            )}
          >
            {route.label}
          </Link>
        ))}
    </nav>
  );
};
