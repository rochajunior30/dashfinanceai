"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../../_components/ui/dialog";
import { Button } from "../../_components/ui/button";
import { Input } from "../../_components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../_components/ui/select";
import { toast, ToastContainer } from "react-toastify"; // Biblioteca para notificações (instalar)
import "react-toastify/dist/ReactToastify.css";

// Tipo para os dados do formulário
interface FormData {
  url: string;
  numeroWhatsapp: string;
  token: string;
  senha?: string; // Opcional
  id?: string; // Opcional
  apiId?: string; // Opcional
}

// Tipo para o payload enviado na requisição
interface Payload extends FormData {
  type: string | null;
}

const SettingsDialog = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    url: "",
    numeroWhatsapp: "",
    token: "",
    senha: "",
    id: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: Payload = {
        type: selectedOption,
        url: formData.url,
        token: formData.token,
        numeroWhatsapp: formData.numeroWhatsapp,
      };

      if (selectedOption === "API_OFICIAL") {
        payload.senha = formData.senha || "";
        payload.apiId = formData.id || "";
      }

      const response = await fetch("api/api-configurations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      toast.success(data.message || "Configurações salvas com sucesso!");

      setIsOpen(false);
      setSelectedOption(null);
      setFormData({ url: "", token: "", senha: "", id: "", numeroWhatsapp: "" });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido.";
      console.error("Erro ao salvar as configurações:", error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormFields = () => {
    if (!selectedOption) return null;

    switch (selectedOption) {
      case "API_OFICIAL":
        return (
          <>
            <Input
              name="url"
              placeholder="URL"
              value={formData.url}
              onChange={handleInputChange}
              className="input-field"
              required
            />
            <Input
              name="token"
              placeholder="Token"
              value={formData.token}
              onChange={handleInputChange}
              className="input-field"
              required
            />
            <Input
              name="numeroWhatsapp"
              placeholder="Unico Whatsapp"
              value={formData.numeroWhatsapp}
              onChange={handleInputChange}
              className="input-field"
              required
            />
            <Input
              name="senha"
              placeholder="Senha"
              type="password"
              value={formData.senha}
              onChange={handleInputChange}
              className="input-field"
              required
            />
            <Input
              name="id"
              placeholder="ID"
              value={formData.id}
              onChange={handleInputChange}
              className="input-field"
              required
            />
          </>
        );
      case "API_EVOLUTION":
      case "N8N":
        return (
          <>
            <Input
              name="url"
              placeholder="URL"
              value={formData.url}
              onChange={handleInputChange}
              className="input-field"
              required
            />
            <Input
              name="token"
              placeholder="Token"
              value={formData.token}
              onChange={handleInputChange}
              className="input-field"
              required
            />
            <Input
              name="numeroWhatsapp"
              placeholder="Whatsapp do Responsável"
              value={formData.numeroWhatsapp}
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
    <>
      {/* Inicializar Toastify */}
      <ToastContainer />

      <div className="flex flex-col items-center space-y-4">
        <Select
          onValueChange={(value) => setSelectedOption(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Escolha a API" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="API_OFICIAL">API Oficial</SelectItem>
            <SelectItem value="API_EVOLUTION">API Evolution</SelectItem>
            <SelectItem value="N8N">N8N</SelectItem>
          </SelectContent>
        </Select>

        {selectedOption && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsOpen(true)}>Configurar</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configurar {selectedOption.replace('_', ' ')}</DialogTitle>
                <DialogDescription>
                  Preencha as informações abaixo para configurar a API.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {renderFormFields()}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
};

export default SettingsDialog;
