import { Appointment } from "@prisma/client";
import { useEffect, useState } from "react";

type UseFilteredTurnsProps = {
  appointments: Appointment[];
  dayId: string;
};

export const useFilteredTurns = ({ appointments, dayId }: UseFilteredTurnsProps) => {
  const [filteredTurns, setFilteredTurns] = useState<Appointment[]>([]);

  useEffect(() => {
    if (appointments && dayId) {
      const selectedTurnIndex = appointments.findIndex(
        (appointment) => appointment.dayId === dayId,
      );
      const filteredTurns = appointments.slice(selectedTurnIndex);
      setFilteredTurns(filteredTurns);
    }
  }, [appointments, dayId]);

  return filteredTurns;
};
