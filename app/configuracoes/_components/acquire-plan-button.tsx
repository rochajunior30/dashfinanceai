
import { auth } from "@clerk/nextjs/server";
import Navbar from "../../_components/navbar";
import { redirect } from "next/navigation";

const SettingsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  

  return (
    <>
      <Navbar />
      
    </>
  );
};

export default SettingsPage;
