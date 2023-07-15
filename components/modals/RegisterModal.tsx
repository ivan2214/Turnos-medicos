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
import { toast, useToast } from "@/components/ui/use-toast";
import { useLoginModal, useRegisterModal } from "@/hooks";
import { useCallback, useState } from "react";
import Modal from "./Modal";
import { ChromeIcon, GithubIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import { Icons } from "../icons";

const FormSchema = z.object({
  email: z
    .string({
      required_error: "A date is required.",
    })
    .nonempty(),
  name: z.string().nonempty({
    message: "A start time is required.",
  }),
  password: z.string().nonempty({
    message: "An end time is required.",
  }),
});

const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const createUserMutation = trpc.createUser.useMutation();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { handleSubmit } = form;
  function onSubmit(data: z.infer<typeof FormSchema>) {
    createUserMutation.mutate({
      email: data?.email,
      name: data?.name,
      password: data?.password,
    });

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-primary p-4  dark:bg-primary-foreground">
          <code className="text-primary-foreground dark:text-gray-300">
            {createUserMutation.error?.shape
              ? JSON.stringify(
                  createUserMutation.error?.shape?.message,
                  null,
                  2,
                )
              : JSON.stringify(data, null, 2)}
          </code>
        </pre>
      ),
    });
    registerModal.onClose();
    router.refresh();
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
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
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
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
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
                <Input type="password" placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );

  const footerContent = (
    <div className="mt-3 flex flex-col gap-4">
      <hr />
      <Button variant="outline" onClick={() => signIn("google")}>
      <Icons.google className="mr-2 h-4 w-4" />
        Continue with Google
      </Button>
      <Button variant="outline" onClick={() => signIn("github")}>
      <Icons.gitHub className="mr-2 h-4 w-4" />
        Continue with Github
      </Button>
      <div
        className="
          mt-4 
          text-center 
          font-light 
          text-neutral-500
        "
      >
        <p>
          Already have an account?
          <span
            onClick={onToggle}
            className="
              cursor-pointer
              text-primary
              hover:underline
            "
          >
            {" "}
            Log in
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
