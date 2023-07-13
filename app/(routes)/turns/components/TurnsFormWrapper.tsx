import { trpc } from "@/utils/trpc";

import { Patient, Appointment } from "@prisma/client";

import { TurnsForm } from "./turns-form";
import { getAppointments } from "@/actions/getAppointments";
import { getDays } from "@/actions/getDays";
import { getStartTimes } from "@/actions/getStartTimes";
import { getEndTimes } from "@/actions/getEndTimes";

type Props = {
  patient: Patient | undefined;
};

export async function TurnsFormWrapper({ patient }: Props) {
  const { appointments } = await getAppointments();
  const { days } = await getDays();
  const { startTimes } = await getStartTimes();
  const { endTimes } = await getEndTimes();

  if (!appointments || !days || !startTimes || !endTimes) {
    return <p>No hay datos...</p>;
  }

  return (
    <TurnsForm
      patient={patient}
      appointments={appointments ?? []}
      days={days}
      startTimes={startTimes}
      endTimes={endTimes}
    />
  );
}
