"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useLoginModal, useRegisterModal } from "@/hooks";
import { useCallback, useEffect, useState } from "react";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChromeIcon, GithubIcon } from "lucide-react";
import Modal from "./ModalActions";
import { trpc } from "@/utils/trpc";

const FormSchema = z.object({
  email: z
    .string({
      required_error: "Email requerido.",
    })
    .nonempty(),
  name: z.string().nonempty({
    message: "Nombre requerido.",
  }),
  password: z
    .string()
    .nonempty({
      message: "Contraseña requerida.",
    })
    .min(8, {
      message: "La contraseña debe contener al menos 8 caracteres.",
    })
    .regex(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      {
        message:
          "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial.",
      },
    ),
});

const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const registerUser = trpc.createUserInternal.useMutation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    registerUser.mutate(data, {
      onSuccess(data, variables, context) {
        toast({
          title: "Registrado!",
          description: "Gracias por registrarte.",
        });
      },
      onError(error, variables, context) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-primary p-4  dark:bg-primary-foreground">
              <code className="text-primary-foreground dark:text-gray-300">
                {JSON.stringify(error, null, 2)}
              </code>
            </pre>
          ),
        });
      },
    });

    registerModal.onClose();
    loginModal.onOpen();
    setTimeout(() => {
      router.refresh();
    }, 500);
  }

  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal]);

  const bodyContent = (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-start justify-center gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormDescription>
                Este sera su correo de registro.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Jhon Doe" {...field} />
              </FormControl>
              <FormDescription>Este sera su nombre de usuario.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="" {...field} />
              </FormControl>
              <FormDescription>
                Debe tener al menos 8 caracteres, una mayúscula, una minúscula,
                un número y un carácter especial.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Registrarse</Button>
      </form>
    </Form>
  );

  const footerContent = (
    <div className="mt-3 flex flex-col gap-4">
      <Button variant="outline" onClick={() => signIn("google")}>
        <ChromeIcon className="mr-2 h-4 w-4" />
        Continuar con Google
      </Button>
      <Button variant="outline" onClick={() => signIn("github")}>
        <GithubIcon className="mr-2 h-4 w-4" />
        Continuar con GitHub
      </Button>
      <div
        className="
  text-center 
  font-light 
  text-neutral-500
"
      >
        <p>
          Ya tienes una cuenta?
          <span
            onClick={onToggle}
            className="
      cursor-pointer
      text-primary
      hover:underline
    "
          >
            {" "}
            Iniciar sesión
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Registrarse"
      description="Registre su cuenta"
      onClose={registerModal.onClose}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
