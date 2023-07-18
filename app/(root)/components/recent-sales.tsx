import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Appointment, Patient } from "@prisma/client";

interface Props {
  appointments: Appointment[];
  patients: Patient[];
}

export function RecentSales({ appointments, patients }: Props) {
  return (
    <div className="w-full space-y-8">
      {patients.map((patient) => {
        return (
          <section
            key={patient.id}
            className="flex w-full flex-col items-start gap-1 lg:flex-row lg:items-center lg:justify-start"
          >
            <div className="flex items-start justify-center gap-2 lg:items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium leading-none">{patient.name}</p>
            </div>
            <div className="ml-10 flex flex-col items-start  lg:m-0 lg:items-center">
              <p className="text-sm text-muted-foreground">{patient.email}</p>
            </div>
            <div className="ml-10 flex flex-col items-start  lg:m-0 lg:items-center">
              <p className="font-medium">{patient.healthInsuranceId}</p>
            </div>
          </section>
        );
      })}
    </div>
  );
}
