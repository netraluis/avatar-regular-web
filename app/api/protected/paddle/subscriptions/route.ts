import { NextResponse } from "next/server";
import {
  Environment,
  LogLevel,
  Paddle,
} from "@paddle/paddle-node-sdk";

export async function GET(
) {

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

  try {
    const subs = await paddle.subscriptions.list().next();
    console.log({ subs });
    return new NextResponse(JSON.stringify(subs), {
      status: 200,
    });
  } catch (error) {
    console.error("Error creating customer:", error);

    return new NextResponse("Failed patching team", {
      status: 500,
    });
  }
}
