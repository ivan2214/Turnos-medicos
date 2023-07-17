"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Route {
  href: string;
  label: string;
  active: boolean;
}

export function MainNavMobile({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

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
      label: "Crear Horarios",
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
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MenuIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {routes.map((route) => (
            <DropdownMenuItem key={route.href}>
              <Link
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
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
