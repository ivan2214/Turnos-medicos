import prisma from "@/app/libs/prismadb";

import { UserClient } from "./components/client";
import { UserColumn } from "./components/columns";

export const revalidate = 0; // revalidate this page every 60 seconds

const page = async () => {
  const users = await prisma.user.findMany({
    include: {
      accounts: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const formattedUsers: UserColumn[] = users?.map((item) => ({
    id: item?.id,
    name: item?.name ?? "",
    email: item?.email ?? "",
    image: item?.image ?? "",
    providerAccount: item?.accounts[0]?.provider ?? "",
    admin: item.admin ?? false,
  }));

  return (
    <div className="flex-col overflow-x-hidden">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UserClient data={formattedUsers} />
      </div>
    </div>
  );
};

export default page;
