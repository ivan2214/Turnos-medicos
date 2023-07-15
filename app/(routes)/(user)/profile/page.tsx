import getCurrentUser from "@/actions/getCurrentUser";

const page = async () => {
  const user = await getCurrentUser();

  return <div>page</div>;
};

export default page;
