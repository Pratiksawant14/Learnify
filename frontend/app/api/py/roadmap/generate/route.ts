import { NextRequest, NextResponse } from 'next/server';

export const config = {
    api: {
        bodyParser: false,
        responseLimit: false,
        externalResolver: true,
    },
    maxDuration: 300, // 5 minutes
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const backendUrl = 'http://127.0.0.1:8000/roadmap/generate';

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            // No timeout - let it take as long as needed
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Backend request failed' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error in roadmap generate proxy:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}
