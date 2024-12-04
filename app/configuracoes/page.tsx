import Navbar from "../_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SettingsDialog from "./_components/settings-dialog";
import SettingsTable from "./_components/settings-table";

const SettingsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  return (
    <>
      {/* Navbar está incluído aqui */}
      <Navbar />
      <div className="flex flex-col items-center space-y-6 p-6">
        <h1 className="text-2xl font-bold">Configurações do Whatsapp</h1>
        <SettingsDialog />
        <SettingsTable />
      </div>
      
      
    </>
  );
};

export default SettingsPage;
