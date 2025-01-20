import { NextRequest, NextResponse } from "next/server";
import { updateTeamByField } from "@/lib/data/team";
import { addTokenLedgerMovement } from "@/lib/data/tokenLedger";
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
      console.log(
        "subscription.created",
        body?.data.id,
        body?.data?.custom_data,
      );
      await updateTeamByField({
        teamId: body?.data?.custom_data?.teamId,
        field: "paddleSubscriptionId",
        value: body?.data.id,
      });

      if (!process.env.SLACK_URL) {
        console.log("SLACK_URL is not defined");
        throw "SLACK_URL is not defined";
      }
      await fetch(process.env.SLACK_URL as string, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: "subscription.created",
          teamId: body?.data?.custom_data?.teamId,
          subscriptionId: body?.data.id,
          userId: body?.data?.custom_data?.userId,
        }),
      });
    }

    if (body?.event_type === "transaction.completed") {
      console.log(
        "transaction.completed",
        body,
        JSON.stringify(body?.data?.items, null, 2),
      );

      const priceId = body.data.items[0].price_id;
      let bodyData: {
        teamId: string;
        tokenAdds: number;
        paddleSubscriptionId?: string;
        runId?: string;
      } = {
        teamId: "",
        tokenAdds: 0,
      };

      if (
        !process.env.HOBBY_PRICE_ID ||
        !process.env.STANDARD_PRICE_ID ||
        !process.env.UNLIMITED_PRICE_ID ||
        !process.env.TOKEN_ADDS_HOBBY ||
        !process.env.TOKEN_ADDS_STANDARD ||
        !process.env.TOKEN_ADDS_UNLIMITED
      ) {
        throw "Environment variables not defined";
      }
      switch (priceId) {
        case process.env.HOBBY_PRICE_ID:
          console.log("Hobby Plan");
          bodyData = {
            teamId: body?.data?.custom_data?.teamId,
            tokenAdds: parseInt(process.env.TOKEN_ADDS_HOBBY),
            paddleSubscriptionId: body?.data?.subscription_id,
          };
          break;
        case process.env.STANDARD_PRICE_ID:
          console.log("Standard Plan");
          bodyData = {
            teamId: body?.data?.custom_data?.teamId,
            tokenAdds: parseInt(process.env.TOKEN_ADDS_STANDARD),
            paddleSubscriptionId: body?.data?.subscription_id,
          };
          break;
        case process.env.UNLIMITED_PRICE_ID:
          console.log("Unlimited Plan");
          bodyData = {
            teamId: body?.data?.custom_data?.teamId,
            tokenAdds: parseInt(process.env.TOKEN_ADDS_UNLIMITED),
            paddleSubscriptionId: body?.data?.subscription_id,
          };
          break;
        default:
          console.log("Unknown Plan");
          break;
      }
      await addTokenLedgerMovement(bodyData);
      await fetch(process.env.SLACK_URL as string, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: "subscription.created",
          teamId: body?.data?.custom_data?.teamId,
          subscriptionId: body?.data.id,
          userId: body?.data?.custom_data?.userId,
        }),
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
