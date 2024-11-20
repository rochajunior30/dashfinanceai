import { auth } from "@clerk/nextjs/server";
import Navbar from "../_components/navbar";
import { redirect } from "next/navigation";




const SettingsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }


  return (
    <>
      <Navbar/>
      <div className="space-y-6 p-6">
      <h1 className="text-2xl text-center font-bold">Configurações</h1>
      </div>
    </>
  );
};

export default SettingsPage;
