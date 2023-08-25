"use client";

import { signIn } from "next-auth/react";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import useRegisterModal from "@/hooks/useRegisterModal";
import useLoginModal from "@/hooks/useLoginModal";

import { Button } from "@/components/ui/button";

import { useToast } from "@/components/ui/use-toast";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ChromeIcon, GithubIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Modal from "./ModalActions";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "../icons";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const FormSchema = z.object({
  email: z.string({
    required_error: "Email requerido.",
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

const LoginModal = () => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    console.log(data);

    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false);
      if (callback?.status === 200) {
        toast({
          variant: "default",
          title: "Bienvenido! 🎉🎉",
          description: "Gracias por volver.",
        });
        setTimeout(() => {
          router.refresh();
        }, 500);
        loginModal.onClose();
      }

      if (callback?.error || callback?.error?.length) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-primary p-4  dark:bg-primary-foreground">
              <code className="text-primary-foreground dark:text-gray-300">
                {callback?.error
                  ? JSON.stringify(callback?.error, null, 2)
                  : JSON.stringify(data, null, 2)}
              </code>
            </pre>
          ),
        });
      }
    });
  };

  const onToggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input id="email" disabled={isLoading} required {...field} />
                </FormControl>
                <FormDescription>
                  Introduzca su correo electrónico
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    disabled={isLoading}
                    required
                    {...field}
                    type="password"
                  />
                </FormControl>
                <FormDescription>Introduzca su contraseña</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Iniciar sesión</Button>
        </form>
      </Form>
    </div>
  );

  const footerContent = (
    <div className="mt-3 flex flex-col gap-4">
      <hr />
      <Button variant="outline" onClick={() => signIn("google")}>
        <ChromeIcon className="mr-2 h-4 w-4" />
        Continuar con google
      </Button>
      <Button variant="outline" onClick={() => signIn("github")}>
        <GithubIcon className="mr-2 h-4 w-4" />
        Continuar con github
      </Button>
      <div
        className="
     text-center font-light text-neutral-500"
      >
        <p>
          Primera vez?
          <span
            onClick={onToggle}
            className="
            cursor-pointer
            text-primary
            hover:underline
          "
          >
            {" "}
            Creee una cuenta
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Iniciar sesión"
      description="Inicie sesión en su cuenta"
      onClose={loginModal.onClose}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
