import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { action, url, token, userId } = await request.json();

    if (!action || !url || !token) {
        return NextResponse.json(
            { error: "Missing required fields: action, url, or token" },
            { status: 400 }
        );
    }

    try {
        let endpoint = "";
        let body = null;
        let method = null;

        switch (action) {
            case "checkInstance":
                endpoint = `${url}instance/connect/${userId}`;
                method = "GET";
                break;

            case "generateQrCode":
                endpoint = `${url}instance/create`;
                body = {
                    instanceName: userId,
                    qrcode: true,
                    integration: "WHATSAPP-BAILEYS",
                };
                method = "POST";
                break;

            case "deleteInstance":
                endpoint = `${url}instance/delete/${userId}`;
                method = "DELETE";
                break;

            default:
                return NextResponse.json(
                    { error: "Invalid action specified" },
                    { status: 400 }
                );
        }

        const response = await fetch(endpoint, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                apikey: token,
            },
            body: body ? JSON.stringify(body) : null,
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const result = await response.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error handling external request:");
        return NextResponse.json(
            { error: "Failed to process request", details: (error as Error).message },
            { status: 500 }
        );
    }
}
