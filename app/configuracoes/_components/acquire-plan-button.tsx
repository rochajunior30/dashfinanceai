
import { auth, clerkClient } from "@clerk/nextjs/server";
import Navbar from "../_components/navbar";
import { redirect } from "next/navigation";
import { useState } from "react";

const SettingsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const user = await clerkClient().users.getUser(userId);
  const userOpenAIKey = user.publicMetadata.openAIKey || "";
  const userWhatsappNumber = user.publicMetadata.whatsappNumber || "";

  const saveSettings = async (data) => {
    try {
      await clerkClient().users.updateUser(userId, {
        publicMetadata: {
          openAIKey: data.openAIKey,
          whatsappNumber: data.whatsappNumber,
        },
      });
      alert("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      alert("Erro ao salvar configurações. Tente novamente.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-black text-white">
        <h1 className="text-2xl font-bold mb-6">Configurações</h1>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const openAIKey = formData.get("openAIKey");
            const whatsappNumber = formData.get("whatsappNumber");
            saveSettings({ openAIKey, whatsappNumber });
          }}
        >
          {/* OpenAI Key Input */}
          <div>
            <label
              htmlFor="openAIKey"
              className="block text-sm font-medium text-gray-300"
            >
              Chave OpenAI
            </label>
            <input
              type="text"
              name="openAIKey"
              id="openAIKey"
              defaultValue={userOpenAIKey}
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white p-2"
              placeholder="Insira sua chave OpenAI"
            />
          </div>

          {/* WhatsApp Number Input */}
          <div>
            <label
              htmlFor="whatsappNumber"
              className="block text-sm font-medium text-gray-300"
            >
              Número do WhatsApp
            </label>
            <input
              type="text"
              name="whatsappNumber"
              id="whatsappNumber"
              defaultValue={userWhatsappNumber}
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white p-2"
              placeholder="Insira seu número de WhatsApp"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md"
          >
            Salvar Configurações
          </button>
        </form>
      </div>
    </>
  );
};

export default SettingsPage;
