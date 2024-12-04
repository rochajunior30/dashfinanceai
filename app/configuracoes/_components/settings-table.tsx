"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "../../_components/ui/button";

const SettingsTable = () => {
    const [configs, setConfigs] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserID] = useState<string | undefined>();
    const [qrCode, setQrCode] = useState<string | null>(null); // Para armazenar o QR Code gerado
    const [isConectedEvo, setIsConectedEvo] = useState<string | null>(null); // Para armazenar o QR Code gerado

    // Buscar configurações
    const fetchConfigs = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/api-configurations");
            const data = await response.json();

            setConfigs(data);
            setUserID(data.userId);
        } catch (error) {
            toast.error("Erro ao carregar configurações.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Deletar configuração
    const deleteConfig = async (id: string) => {
        try {
            const response = await fetch(`/api/api-configurations?id=${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Erro ao deletar configuração.");
            }

            toast.success("Configuração removida com sucesso!");
            fetchConfigs(); // Recarregar os dados
        } catch (error) {
            toast.error("Erro ao deletar configuração.");
            console.error(error);
        }
    };

    // Abrir modal de edição
    const editConfig = (config: any) => {
        console.log("Editar configuração:", config);
        // Lógica para abrir um modal de edição (a implementar)
    };

    // Gerar QR-Code
    const generateQRCode = async (config: any) => {
        try {
            const bodys = {
                instanceName: `${userId}`,
                qrcode: true, // (Opcional)
                integration: "WHATSAPP-BAILEYS",
            };

            const response = await fetch(`${config.url}instance/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    apiKey: `${config.token}`, // Autenticação com o token
                },
                body: JSON.stringify(bodys),
            });

            if (!response.ok) {
                throw new Error("Erro ao gerar QR-Code.");
            }

            const result = await response.json();
            console.log("QR-Code gerado:", result.qrcode);

            if (result.qrcode?.base64) {
                setQrCode(result.qrcode.base64); // Atualizar o QR Code no estado
                toast.success("QR-Code gerado com sucesso!");
            } else {
                toast.error("QR-Code não encontrado na resposta.");
            }
        } catch (error) {
            toast.error("Erro ao gerar QR-Code.");
            console.error(error);
        }
    };
    const checkInstance = async (config: any) => {
        try {
            const response = await fetch(`${config.url}instance/connect/${userId}`);
            if (!response.ok) {
                throw new Error("Erro ao verificar conexão instancia.");
            }
            const result = await response.json();
            setIsConectedEvo(result)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchConfigs();
        checkInstance(configs)
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Configurações Cadastradas</h2>

            {isLoading ? (
                <p>Carregando...</p>
            ) : configs ? (
                <table className="table-auto w-full border-collapse border border-gray-700">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="border border-gray-700 p-2">Tipo</th>
                            <th className="border border-gray-700 p-2">URL</th>
                            <th className="border border-gray-700 p-2">Token</th>
                            <th className="border border-gray-700 p-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr key={configs.id} className="text-center">
                            <td className="border border-gray-700 p-2">{configs.type}</td>
                            <td className="border border-gray-700 p-2">{configs.url}</td>
                            <td className="border border-gray-700 p-2">{configs.token}</td>
                            <td className="border border-gray-700 p-2 space-x-2">
                                {configs.type === "API_EVOLUTION" ? (
                                    <Button
                                        variant="outline"
                                        onClick={() => generateQRCode(configs)}
                                    >
                                        Gerar QR-Code
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        onClick={() => editConfig(configs)}
                                    >
                                        Editar
                                    </Button>
                                )}
                                <Button
                                    variant="destructive"
                                    onClick={() => deleteConfig(configs.id)}
                                >
                                    Deletar
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                <p>Nenhuma configuração cadastrada.</p>
            )}

            {/* Exibir QR Code */}
            {qrCode && (
                <div className="mt-6 flex flex-col items-center">
                    <h3 className="text-lg font-bold mb-4">QR Code Gerado</h3>
                    <img src={qrCode} alt="QR Code" className="border border-gray-700 rounded-md" />
                </div>
            )}
        </div>
    );
};

export default SettingsTable;
