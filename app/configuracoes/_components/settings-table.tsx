"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "../../_components/ui/button";

interface Config {
    id: string;
    userId: string;
    type: string;
    url: string;
    numeroWhatsapp?: string;
    token: string;
    senha?: string | null;
    apiId?: string | null;
}

const SettingsTable = () => {
    const [configs, setConfigs] = useState<Config | null>(null); // Alterado para aceitar um único objeto
    const [isLoading, setIsLoading] = useState(false);
    const [qrCode, setQrCode] = useState<string | null>(null); // QR Code gerado
    const [isCheckingInstance, setIsCheckingInstance] = useState(false);
    type ConnectionStatus = "connected" | "disconnected" | "connecting" | null;
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(null);

    // Buscar configurações
    const fetchConfigs = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/api-configurations");
            const data = await response.json();

            if (data && data.id) {
                setConfigs(data); // Armazena o objeto retornado
            } else {
                setConfigs(null); // Caso não haja configuração válida
            }
        } catch (error) {
            toast.error("Erro ao carregar configurações.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const checkInstance = async (config: Config) => {
        if (!config || config.type !== "API_EVOLUTION") return;

        setIsCheckingInstance(true);
        try {
            const response = await fetch("/api/evo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "checkInstance",
                    url: config.url,
                    token: config.token,
                    userId: config.userId,
                }),
            });

            if (response.status === 404) {
                setConnectionStatus("disconnected");
                return;
            }

            const result = await response.json();
            if (result?.instance?.state === "open") {
                setConnectionStatus("connected");
            }
            if (result?.instance?.base64) {
                setConnectionStatus("connecting");
                setQrCode(result.instance.base64); // Atualizar o QR Code no estado
                toast.success("QR-Code gerado com sucesso!");
            }
        } catch (error) {
            console.error("Erro ao verificar conexão da instância:", error);
            setConnectionStatus("disconnected");
        } finally {
            setIsCheckingInstance(false);
        }
    };

    const generateQRCode = async (config: Config) => {
        try {
            const response = await fetch("/api/evo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "generateQrCode",
                    url: config.url,
                    token: config.token,
                    userId: config.userId,
                }),
            });

            if (!response.ok) {
                throw new Error("Erro ao gerar QR-Code.");
            }

            const result = await response.json();
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

    const deleteInstance = async (config: Config) => {
        try {
            const response = await fetch("/api/evo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "deleteInstance",
                    url: config.url,
                    token: config.token,
                    userId: config.userId,
                }),
            });

            if (!response.ok) {
                throw new Error("Erro ao deletar a instância.");
            }

            toast.success("Instância deletada com sucesso!");
            setQrCode(null); // Remove o QR Code da tela
            setConnectionStatus("disconnected");
        } catch (error) {
            toast.error("Erro ao deletar a instância.");
            console.error(error);
        }
    };

    // Buscar configurações ao carregar a página
    useEffect(() => {
        fetchConfigs();
    }, []);

    // Verificar instância após `configs` ser atualizado
    useEffect(() => {
        if (configs) {
            checkInstance(configs);
        }
    }, [configs]);

    return (
        <div className="space-y-6">
            {isLoading ? (
                <p>Carregando...</p>
            ) : isCheckingInstance ? (
                <p>Verificando conexão...</p>
            ) : connectionStatus === "connected" ? (
                <div className="flex items-center space-x-2 mt-4">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <p className="text-lg font-semibold">Você está conectado!</p>
                </div>
            ) : (
                <div>
                    {configs ? (
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
                                <tr className="text-center">
                                    <td className="border border-gray-700 p-2">{configs.type}</td>
                                    <td className="border border-gray-700 p-2">{configs.url}</td>
                                    <td className="border border-gray-700 p-2">
                                        {configs.token ? `****${configs.token.slice(-10)}` : ""}
                                    </td>
                                    <td className="border border-gray-700 p-2 space-x-2">
                                        {configs.type === "API_EVOLUTION" ? (
                                            <div className="flex justify-between text-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => generateQRCode(configs)}
                                                >
                                                    Gerar QR-Code
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() => deleteInstance(configs)}
                                                >
                                                    Deletar
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                onClick={() => deleteInstance(configs)}
                                            >
                                                Deletar
                                            </Button>
                                        )}
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
                            <h3 className="text-lg font-bold mb-4">
                                Leia o QR Code com seu WhatsApp Business!
                            </h3>
                            <img
                                src={qrCode}
                                alt="QR Code"
                                className="border border-gray-200 rounded-md"
                            />
                            <div className="mt-4 space-x-4">
                                <Button
                                    variant="outline"
                                    onClick={() => configs && checkInstance(configs)}
                                >
                                    Recriar QR Code
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => configs && deleteInstance(configs)}
                                >
                                    Deletar Instância
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SettingsTable;
