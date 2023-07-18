import prismadb from "@/app/libs/prismadb";

import { UserForm } from "./components/user-form";
import { User } from "@prisma/client";

const UserPage = async ({ params }: { params: { userId: string } }) => {
  const user = await prismadb.user.findUnique({
    where: {
      id: params?.userId,
    },
  });

  return (
    <div className="w-full flex-col">
      <div className="w-full flex-1 space-y-4  py-6 lg:p-8 lg:py-0 lg:pt-6">
        <UserForm initialData={user} />
      </div>
    </div>
  );
};

export default UserPage;
