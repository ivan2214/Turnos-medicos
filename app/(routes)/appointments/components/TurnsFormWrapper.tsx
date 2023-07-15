import { User } from "@prisma/client";

import { TurnsForm } from "./turns-form";

import { getDays } from "@/actions/getDays";
import { getStartTimes } from "@/actions/getStartTimes";
import { getEndTimes } from "@/actions/getEndTimes";
import getAppointments from "@/actions/getAppointments";

type Props = {
  user: User | undefined;
};

export async function TurnsFormWrapper({ user }: Props) {
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
      user={user}
      appointments={safeAppointments}
      days={days}
      startTimes={startTimes}
      endTimes={endTimes}
    />
  );
}
