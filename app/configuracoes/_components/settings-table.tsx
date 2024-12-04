"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "../../_components/ui/button";

const SettingsTable = () => {
    const [configs, setConfigs] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserID] = useState<string | undefined>();
    const [qrCode, setQrCode] = useState<string | null>(null); // Para armazenar o QR Code gerado
    const [isCheckingInstance, setIsCheckingInstance] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | null>(null);

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

    const checkInstance = async (config: any) => {
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
            } else {
                setConnectionStatus("disconnected");
            }
        } catch (error) {
            console.error("Erro ao verificar conexão da instância:", error);
            setConnectionStatus("disconnected");
        } finally {
            setIsCheckingInstance(false);
        }
    };
    
    const generateQRCode = async (config: any) => {
        try {
            const response = await fetch("/api/evo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    action: "generateQrCode",
                    url: config.url,
                    token: config.token,
                    userId,
                }),
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
                                <tr key={configs.id} className="text-center">
                                    <td className="border border-gray-700 p-2">{configs.type}</td>
                                    <td className="border border-gray-700 p-2">{configs.url}</td>
                                    <td className="border border-gray-700 p-2">{configs.token ? `****${configs.token.slice(-10)}` : ""}</td>
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
                                                onClick={() => console.log("Editar configuração:", configs)}
                                            >
                                                Editar
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
                            <h3 className="text-lg font-bold mb-4">Leia o QR Code com seu whatsapp business!</h3>
                            <img src={qrCode} alt="QR Code" className="border border-gray-700 rounded-md" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SettingsTable;
