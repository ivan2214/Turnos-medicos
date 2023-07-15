import { Patient } from "@prisma/client";

import { TurnsForm } from "./turns-form";

import { getDays } from "@/actions/getDays";
import { getStartTimes } from "@/actions/getStartTimes";
import { getEndTimes } from "@/actions/getEndTimes";
import getAppointments from "@/actions/getAppointments";

type Props = {
  patient: Patient | undefined;
};

export async function TurnsFormWrapper({ patient }: Props) {
  const { safeAppointments } = await getAppointments({
    busy: false,
  });
  const { days } = await getDays();
  const { startTimes } = await getStartTimes();
  const { endTimes } = await getEndTimes();
  
  console.log({ safeAppointments });
  
  /* if (
    !safeAppointments ||
    !days.length ||
    !startTimes?.length ||
    !endTimes?.length
  ) {
    return <p>No hay datos...</p>;
  } */


  return (
    <TurnsForm
      patient={patient}
      appointments={safeAppointments}
      days={days}
      startTimes={startTimes}
      endTimes={endTimes}
    />
  );
}
