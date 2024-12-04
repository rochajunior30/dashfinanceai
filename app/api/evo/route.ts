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

        switch (action) {
            case "checkInstance":
                endpoint = `${url}instance/connect/${userId}`;
                break;

            case "generateQrCode":
                endpoint = `${url}instance/create`;
                body = {
                    instanceName: userId,
                    qrcode: true,
                    integration: "WHATSAPP-BAILEYS",
                };
                break;

            default:
                return NextResponse.json(
                    { error: "Invalid action specified" },
                    { status: 400 }
                );
        }

        const response = await fetch(endpoint, {
            method: body ? "POST" : "GET",
            headers: {
                "Content-Type": "application/json",
                apiKey: token,
            },
            body: body ? JSON.stringify(body) : null,
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const result = await response.json();
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error handling external request:", error.message);
        return NextResponse.json(
            { error: "Failed to process request", details: error.message },
            { status: 500 }
        );
    }
}
