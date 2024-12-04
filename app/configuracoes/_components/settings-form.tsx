"use client"; // Indica que este é um Client Component
import { useState } from "react";

const SettingsForm = () => {
  const [selectedOption, setSelectedOption] = useState<string>("API Oficial");
  const [formData, setFormData] = useState<any>({
    url: "",
    token: "",
    senha: "",
    id: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, type: selectedOption };

    // Simulação de envio para o backend
    console.log("Dados enviados:", payload);
    alert("Configurações salvas com sucesso!");
  };

  const renderFormFields = () => {
    switch (selectedOption) {
      case "API Oficial":
        return (
          <>
            <input
              type="text"
              name="url"
              placeholder="URL"
              value={formData.url}
              onChange={handleInputChange}
              className="input-field"
            />
            <input
              type="text"
              name="token"
              placeholder="Token"
              value={formData.token}
              onChange={handleInputChange}
              className="input-field"
            />
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              value={formData.senha}
              onChange={handleInputChange}
              className="input-field"
            />
            <input
              type="text"
              name="id"
              placeholder="ID"
              value={formData.id}
              onChange={handleInputChange}
              className="input-field"
            />
          </>
        );
      case "API Evolution":
        return (
          <>
            <input
              type="text"
              name="url"
              placeholder="URL"
              value={formData.url}
              onChange={handleInputChange}
              className="input-field"
            />
            <input
              type="text"
              name="token"
              placeholder="Token"
              value={formData.token}
              onChange={handleInputChange}
              className="input-field"
            />
          </>
        );
      case "N8N":
        return (
          <>
            <input
              type="text"
              name="url"
              placeholder="URL"
              value={formData.url}
              onChange={handleInputChange}
              className="input-field"
            />
            <input
              type="text"
              name="token"
              placeholder="Token"
              value={formData.token}
              onChange={handleInputChange}
              className="input-field"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <label htmlFor="api-selector" className="font-medium">
        Escolha a API:
      </label>
      <select
        id="api-selector"
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        className="rounded-md bg-gray-600 border-gray-400 p-2 text-primary w-full md:w-auto"
      >
        <option value="API Oficial">API Oficial</option>
        <option value="API Evolution">API Evolution</option>
        <option value="N8N">N8N</option>
      </select>
      <form onSubmit={handleSubmit} className="space-y-4">
        {renderFormFields()}
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-full font-bold hover:bg-inherit"
        >
          Salvar Configurações
        </button>
      </form>
    </div>
  );
};

export default SettingsForm;
