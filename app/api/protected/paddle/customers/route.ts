import { NextRequest, NextResponse } from "next/server";
import { Environment, LogLevel, Paddle } from "@paddle/paddle-node-sdk";

export async function POST(request: NextRequest) {
  // { params }: { params: { teamId: string } },
  if (!process.env.PADDLE_API_KEY) {
    return new NextResponse("Paddle API Key is required", {
      status: 400,
    });
  }

  const paddle = new Paddle(process.env.PADDLE_API_KEY, {
    environment: Environment.sandbox, // or Environment.sandbox for accessing sandbox API
    logLevel: LogLevel.verbose, // or 'error' for less verbose logging
  });
  // const paddle = new Paddle(process.env.PADDLE_API_KEY)
  const body = await request.json();

  const formBody = new URLSearchParams();
  formBody.append("email", "prueba@gmail.com");
  formBody.append("name", "man");

  try {
    const cust = await paddle.customers.create({
      email: body.email,
    });
    return new NextResponse(JSON.stringify(cust.id), {
      status: 200,
    });

    // const cust = await paddle.customers.list().next()
    // console.log({cust})
  } catch (error) {
    console.error("Error creating customer:", error);

    return new NextResponse("Failed patching team", {
      status: 500,
    });
  }
}
