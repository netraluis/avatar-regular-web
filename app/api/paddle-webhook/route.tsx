import { NextRequest, NextResponse } from "next/server";
import { updateTeamByField } from "@/lib/data/team";
// import { Environment, LogLevel, Paddle } from "@paddle/paddle-node-sdk";

export async function POST(
  request: NextRequest,
  // { params }: { params: { teamId: string } },
) {


  console.log("Paddle webhook");
  if (!process.env.PADDLE_API_KEY) {
    return new NextResponse("Paddle API Key is required", {
      status: 400,
    });
  }
  // const paddle = new Paddle(process.env.PADDLE_API_KEY)

  // const paddle = new Paddle(process.env.PADDLE_API_KEY, {
  //   environment: Environment.sandbox, // or Environment.sandbox for accessing sandbox API
  //   logLevel: LogLevel.verbose, // or 'error' for less verbose logging
  // });

  try {
    const body = await request.json();

    console.log(body?.event_type);

    if (body?.event_type === "customer.created") {
      console.log("customer.created", body?.data?.id);
      // const response = await fetch(
      //   `https://api.paddle.com/customers/${'ctm_01jffznkzzryrwemvee75kdrp1'}/portal-sessions`,
      //   {
      //     method: "POST",
      //     headers: {
      //       Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
      //       'Content-Type': 'application'
      //     }
      //     // body: JSON.stringify({
      //     //   subscription_ids: ['sub_01h04vsc0qhwtsbsxh3422wjs4']
      //     // })
      //   },
      // );

      // if (!response.ok) {
      //   throw new Error(
      //     `Error getting url: ${response.statusText}`,
      //   );
      // }

      // console.log({ response })

      // try{
      //   await updateUser({})
      // }
    }

    // const cust = await paddle.customers.list().next()
    // console.log({cust})

    if (body?.event_type === "subscription.canceled") {
      console.log("sub canceled", body?.data.id);

      // const sub = await paddle.subscriptions.get(body?.data?.subscription_id)

      // for (const sub of subs) {
      //   console.log(sub)
      //   await paddle.subscriptions.cancel(sub.id, {
      //     effectiveFrom: "immediately"
      //   })
      // }

      console.log({
        teamId: body?.data?.custom_data?.teamId,
        field: "paddleSubscriptionId",
        value: body?.data.id,
      });
      if (!body?.data?.custom_data?.teamId) return;

      // const updateTeam = await updateTeamByField({
      //   teamId: body?.data?.custom_data?.teamId,
      //   field: "paddleSubscriptionId",
      //   value: null,
      // });

      // console.log({ updateTeam });
    }

    if (body?.event_type === "subscription.created") {
      console.log("subscription.created", body?.data.id, body?.data?.custom_data);
      await updateTeamByField({
        teamId: body?.data?.custom_data?.teamId,
        field: "paddleSubscriptionId",
        value: body?.data.id,
      });
    }

    // console.log({event_type: body })

    // if (!body?.data) {
    //   return new NextResponse("data is required", {
    //     status: 400,
    //   });
    // }

    return new NextResponse(JSON.stringify("success"), {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating team:", error);

    return new NextResponse("Failed patching team", {
      status: 500,
    });
  }
}
