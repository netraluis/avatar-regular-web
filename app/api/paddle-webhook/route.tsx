import { NextRequest, NextResponse } from "next/server";
import { updateTeamByField } from "@/lib/data/team";
import { createSubscription, createSubscriptionCycle, updateSubscription } from "@/lib/data/subscription";
import { Subscription } from "@prisma/client";
import { getMonthlyCycles } from "@/lib/helper/date";
// import { Environment, LogLevel, Paddle } from "@paddle/paddle-node-sdk";

export async function POST(
  request: NextRequest,
  // { params }: { params: { teamId: string } },
) {
  console.log("Paddle webhook",);
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


    if (body?.event_type === 'subscription.updated') {
      console.log('subscription.updated', body)
      const subscriptionUpdated = await updateSubscription(
        { id: body?.data.id },
        {
          priceId: body?.data.items[0].price.id,
          status: body?.data.status,
          scheduleChange: body?.data.schedule_change,
          endBillingData: body?.data.next_billed_at,
          startBillingData: body?.data.first_billed_at,
        }
      )

      const monthlyCylces = getMonthlyCycles(subscriptionUpdated)

      await createSubscriptionCycle(monthlyCylces)

      if (!process.env.SLACK_URL) {
        // console.log("SLACK_URL is not defined");
        throw "SLACK_URL is not defined";
      }
      // await fetch(process.env.SLACK_URL as string, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   // body: JSON.stringify({
      //     // text: {
      //     //   event: "subscription.created",
      //     //   teamId: body?.data?.custom_data?.teamId,
      //     //   subscriptionId: body?.data.id,
      //     //   userId: body?.data?.custom_data?.userId,
      //     // }
      //   // }),

      //   body: JSON.stringify({
      //     text: 'hola'
      //   }),
      // });

      await fetch(process.env.SLACK_URL as string, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: JSON.stringify({
            event: "subscription.created",
            teamId: body?.data?.custom_data?.teamId,
            subscriptionId: body?.data?.id,
            userId: body?.data?.custom_data?.userId,
          }, null, 2), // `null, 2` para formato legible en Slack
        }),
      });
    }


    if (body?.event_type === "subscription.created") {
      // console.log(
      //   "subscription.created",
      //   body?.data.id,
      //   body?.data?.custom_data,
      // );
      console.log({ body: JSON.stringify(body, null, 2) })
      await updateTeamByField({
        teamId: body?.data?.custom_data?.teamId,
        field: "paddleSubscriptionId",
        value: body?.data.id,
      });

      const subscriptionCreated: Subscription = await createSubscription({
        id: body?.data.id,
        // teamId: body?.data?.custom_data?.teamId || "",
        team: {
          connect: {
            id: body?.data?.custom_data?.teamId || ""
          }
        },
        status: body?.data.status,
        priceId: body?.data.items[0].price.id,
        scheduleChange: body?.data.schedule_change,
        endBillingData: body?.data.next_billed_at,
        startBillingData: body?.data.first_billed_at,
      })

      const monthlyCylces = getMonthlyCycles(subscriptionCreated)

      await createSubscriptionCycle(monthlyCylces)


      if (!process.env.SLACK_URL) {
        // console.log("SLACK_URL is not defined");
        throw "SLACK_URL is not defined";
      }
      await fetch(process.env.SLACK_URL as string, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: JSON.stringify({
            event: "subscription.created",
            teamId: body?.data?.custom_data?.teamId,
            subscriptionId: body?.data.id,
            userId: body?.data?.custom_data?.userId,
          }, null, 2)
        }),
      });
    }

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
