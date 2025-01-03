import { NextResponse } from "next/server";
// import {
//   Environment,
//   LogLevel,
//   Paddle,
//   Subscription,
//   SubscriptionStatus,
// } from "@paddle/paddle-node-sdk";

export async function GET() {
  // request: NextRequest,
  // { params }: { params: { teamId: string } },
  if (!process.env.PADDLE_API_KEY) {
    return new NextResponse("Paddle API Key is required", {
      status: 400,
    });
  }
  // const paddle = new Paddle(process.env.PADDLE_API_KEY)

  try {
    const response = await fetch(`https://sandbox-api.paddle.com/prices`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      throw new Error(`Error getting url: ${response.statusText}`);
    }

    const res = await response.json();

    console.log({ res: res.data });
    return new NextResponse(JSON.stringify(res.data), {
      status: 200,
    });

    // const cust = await paddle.customers.list().next()
    // console.log({cust})
  } catch (error) {
    console.error("Error updating team:", error);

    return new NextResponse("Failed patching team", {
      status: 500,
    });
  }
}
