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

import { HealthInsurance, User } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/utils/trpc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface UserFormProps {
  initialData: User | null | undefined;
}

export const UserForm: React.FC<UserFormProps> = ({ initialData }) => {
  const formSchema = z.object({
    name: z.string().min(3),
    email: z.string().email().min(3),
    password: initialData?.hashedPassword
      ? z.string().min(6).optional()
      : z.string().min(6),
    admin: z.boolean().default(false).optional(),
  });

  type UserFormValues = z.infer<typeof formSchema>;
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const createUser = trpc.createUserInternal.useMutation();
  const updateUser = trpc.updateUserInternal.useMutation();
  const deleteUserForm = trpc.deleteUserInternal.useMutation();

  const title = initialData ? "Editar Usuario" : "Crear Usuario";
  const description = initialData
    ? "Editar a Usuario."
    : "Añadir un nuevo usuario";
  const toastMessage = initialData ? "Usuario Actualizado." : "Usuario creado.";
  const action = initialData ? "Guardar cambios" : "Crear";

  const defaultValues = initialData
    ? {
        ...initialData,
        password: initialData.hashedPassword,
      }
    : {};

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      setLoading(true);

      if (initialData && initialData.id && initialData.hashedPassword) {
        updateUser.mutate(
          {
            email: data.email,
            name: data.name,
            admin: data.admin ?? false,
            userId: initialData.id,
            password: data.password || undefined,
          },
          {
            onError(error, variables, context) {
              toast({
                title: "Something went wrong.",
                description: error.message,
              });
            },
          },
        );
      } else {
        createUser.mutate(
          {
            email: data.email,
            name: data.name,
            admin: data.admin ?? false,
            password: data.password!,
          },
          {
            onError(error, variables, context) {
              toast({
                title: "Something went wrong.",
                description: error.message,
              });
            },
          },
        );
      }
      router.push(`/users`);
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Something went wrong.",
      });
    } finally {
      toast({
        title: toastMessage,
        description: "User updated.",
      });
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
      setTimeout(() => {
        router.refresh();
      }, 600);
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
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="JhonDoe45*"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Porfavor introduzca una contraseña
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="admin"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Administrador</FormLabel>
                    <FormDescription>
                      Marcar este usuario como administrador
                    </FormDescription>
                  </div>
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
