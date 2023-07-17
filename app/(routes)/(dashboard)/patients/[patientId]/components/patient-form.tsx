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

import { HealthInsurance, Patient } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/utils/trpc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(3),
  email: z.string().email().min(3),
  healthInsuranceId: z.string().uuid().optional(),
});

type PatientFormValues = z.infer<typeof formSchema>;

interface PatientFormProps {
  initialData: Patient | null;
  healthInsurances: HealthInsurance[] | null | undefined;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  initialData,
  healthInsurances,
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const createPatient = trpc.createPatientInternal.useMutation();
  const deletePatientForm = trpc.deletePatientInternal.useMutation();

  const title = initialData ? "Editar patient" : "Crear patient";
  const description = initialData
    ? "Editar a patient."
    : "Añadir un nuevo paciente";
  const toastMessage = initialData
    ? "Paciente Actualizado."
    : "Paciente creado.";
  const action = initialData ? "Guardar cambios" : "Crear";

  const defaultValues = initialData
    ? {
        ...initialData,
      }
    : {};

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: PatientFormValues) => {
    try {
      setLoading(true);

      createPatient.mutate(
        {
          email: data.email,
          name: data.name,
          healthInsuranceId: data.healthInsuranceId,
        },
        {
          onSuccess(data, variables, context) {
            toast({
              title: toastMessage,
              description: "Patient updated.",
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
      router.push(`/patients`);
      setTimeout(() => {
        router.refresh();
      }, 600);
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
      deletePatientForm.mutate(
        {
          patientId: initialData?.id!,
        },
        {
          onSuccess(data, variables, context) {
            toast({
              title: "Patient deleted.",
              description: "Patient updated.",
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
      router.push(`/patients`);
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
              name="healthInsuranceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Obra social</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Seleccione una obra socialll"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {healthInsurances?.map((healthInsurance) => (
                        <SelectItem
                          key={healthInsurance?.id}
                          value={healthInsurance?.id}
                        >
                          {healthInsurance?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
