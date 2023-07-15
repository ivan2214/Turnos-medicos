import Container from "@/components/ui/container";
import EmptyState from "@/components/empty-state";

import getAppointments, {
  IAppointmentsParams,
} from "@/actions/getAppointments";
import getCurrentUser from "@/actions/getCurrentUser";
import ClientOnly from "@/components/ClientOnly";
import { redirect } from "next/navigation";

interface HomeProps {
  searchParams: IAppointmentsParams;
}

const Home = async ({ searchParams }: HomeProps) => {
  const { safeAppointments } = await getAppointments(searchParams);
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/auth");

  if (safeAppointments?.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <Container>
        <div
          className="
            grid
            grid-cols-1 
            gap-8 
            pt-24 
            sm:grid-cols-2 
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
            2xl:grid-cols-6
          "
        >
          cards
        </div>
      </Container>
    </ClientOnly>
  );
};

export default Home;
