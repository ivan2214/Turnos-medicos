import { Metadata } from "next";
import { UserAuthForm } from "@/components/user-auth-form";
import getCurrentUser from "@/actions/getCurrentUser";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default async function AuthenticationPage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="container grid h-1/2 place-items-center  py-10">
      <section className="container  grid h-full flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
        <section className="relative hidden h-full flex-col rounded-md bg-muted p-10 text-white dark:border-r lg:flex ">
          <article className="flex h-full flex-col  items-start justify-between">
            <div className="absolute inset-0 rounded-md bg-zinc-900" />
            <div className="relative z-20 flex items-center text-lg font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-6 w-6"
              >
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
              </svg>
              Acme Inc
            </div>
            <div className="relative z-20">
              <blockquote className="space-y-2">
                <p className="text-lg">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Ipsam odit aliquam necessitatibus tempore esse sapiente
                  voluptatem ex blanditiis laborum quas culpa libero beatae
                  explicabo quae ipsa ad, saepe modi id?
                </p>
                <footer className="text-sm">Jhon doe</footer>
              </blockquote>
            </div>
          </article>
        </section>
        <section className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Crear tu cuenta
            </h1>
            <p className="text-sm text-muted-foreground">
              Ingrese su correo electrónico a continuación para crear su cuenta
            </p>
          </div>
          <UserAuthForm currentUser={currentUser} />
        </section>
      </section>
    </div>
  );
}
