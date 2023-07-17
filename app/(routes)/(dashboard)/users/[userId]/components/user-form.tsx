"use client";

import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
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
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import AlertModal from "@/components/modals/alert-modal";

import { User, Day } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/utils/trpc";

const formSchema = z.object({
  name: z.string().min(3),
  email: z.string().email().min(3),
  password: z.string().min(6),
});

type UserFormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  initialData: User | null;
}

export const UserForm: React.FC<UserFormProps> = ({ initialData }) => {
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const createUser = trpc.createUser.useMutation();
  const deleteUserForm = trpc.deleteUserInternal.useMutation();

  const title = initialData ? "Edit user" : "Create user";
  const description = initialData ? "Edit a user." : "Add a new user";
  const toastMessage = initialData ? "User updated." : "User created.";
  const action = initialData ? "Save changes" : "Create";

  const defaultValues = initialData
    ? {
        ...initialData,
      }
    : {};

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      setLoading(true);

      createUser.mutate(
        {
          email: data.email,
          name: data.name,
          password: data.password,
        },
        {
          onSuccess(data, variables, context) {
            toast({
              title: toastMessage,
              description: "User updated.",
            });
          },
          onError(error, variables, context) {
            toast({
              title: "Something went wrong.",
              description: error.message,
            });
          },
        },
      );
      router.push(`/users`);
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      deleteUserForm.mutate(
        {
          userId: initialData?.id!,
        },
        {
          onSuccess(data, variables, context) {
            toast({
              title: "User deleted.",
              description: "User updated.",
            });
          },
          onError(error, variables, context) {
            toast({
              title: "Something went wrong.",
              description: error.message,
            });
          },
        },
      );
      router.push(`/users`);
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Something went wrong.",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="jhon" {...field} />
                  </FormControl>
                  <FormDescription>
                    Porfavor introduzca un nombre
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="jhon@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Porfavor introduzca un email
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
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Porfavor introduzca una Contraseña
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
