import { NextRequest, NextResponse } from "next/server";
import { updateTeamByField } from "@/lib/data/team";
import {
  createSubscription,
  createSubscriptionCycle,
  getSubscription,
  updateSubscription,
} from "@/lib/data/subscription";
import { Prisma, Subscription } from "@prisma/client";
import { getMonthlyCycles } from "@/lib/helper/date";
import { getProrationBillingMode } from "@/lib/helper/subscription";
// import { Environment, LogLevel, Paddle } from "@paddle/paddle-node-sdk";

const normalizeDate = (date: Date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setMilliseconds(0);
  return normalizedDate.toISOString();
};

export async function POST(
  request: NextRequest,
  // { params }: { params: { teamId: string } },
) {
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
    console.log(body);
    if (!body) return;

    if (body?.event_type === "subscription.updated") {
      const actualSubscription = await getSubscription({ id: body?.data.id });
      const newSubscription = {
        priceId: body.data.items[0].price.id,
        status: body.data.status,
        scheduleChange: body.data.schedule_change || null,
        endBillingData: normalizeDate(new Date(body.data.next_billed_at)),
        startBillingData: normalizeDate(new Date(body.data.first_billed_at)),
      };

      const formattedOldSubscription = {
        priceId: actualSubscription.priceId,
        status: actualSubscription.status,
        scheduleChange: actualSubscription.scheduleChange,
        endBillingData: normalizeDate(
          new Date(actualSubscription.endBillingData),
        ),
        startBillingData: normalizeDate(
          new Date(actualSubscription.startBillingData),
        ),
      };

      const diferences = {
        priceId: newSubscription.priceId !== formattedOldSubscription.priceId,
        status: newSubscription.status !== formattedOldSubscription.status,
        scheduleChange:
          newSubscription.scheduleChange !==
          formattedOldSubscription.scheduleChange,
        endBillingData:
          newSubscription.endBillingData !==
          formattedOldSubscription.endBillingData,
        startBillingData:
          newSubscription.startBillingData !==
          formattedOldSubscription.startBillingData,
      };

      /**
       * Diferentes casos de actualización de la suscripción
       *  1- Cambio de precio
       *    1.1 - Cambio de precio con prorrateo inmediato ✅
       *      se detecta: porqué el precio anterior es menor al nuevo precio ()
       *      se hace: se actualiza el precio y se crea un nuevo createSubscriptionCycle
       *    1.2 - Cambio de precio con prorrateo al final del ciclo ✅
       *      se detecta: porqué el precio anterior es mayor al nuevo precio
       *      se hace: se espera al renew de la suscripción para actualizar el precio y crear un nuevo createSubscriptionCycle
       *  2- Cambio de estado ✅
       *      se detecta: porqué el estado anterior es diferente al nuevo estado
       *      se hace: se actualizan los estados del subCycle del ciclo presente y de futuro y de la suscripción
       *  3- Renovación de la suscripción ✅
       *      se detecta: porqué el endBillingData y startBillingData es diferente al anterior
       *
       *  ----FUTURO----
       *
       *    inscripciones anuales
       *
       *  4- Cambio de ciclo se pasa de una suscripción mensual a una anual
       *    se detecta: por el precio anterior que es de caracter mensual y el nuevo es anual
       *    se hace: se actualiza el precio y se crea un nuevo createSubscriptionCycle en base al nuevo
       *        endBillingData y startBillingData
       *  5- Cambio de ciclo se pasa de una suscripción anual a una mensual
       *   se detecta: por el precio anterior que es de caracter anual y el nuevo es mensual
       *   se hace: se espera a que termine el ciclo anual para actualizar el precio y crear un nuevo createSubscriptionCycle
       *
       *  6 - Cambio de ciclo se pasa de una suscripción anual a una anual
       *   6.1 - Cambio de ciclo con prorrateo inmediato
       *   se detecta: porqué el precio anterior es menor al nuevo precio
       *   se hace: se actualiza el precio y se crea un nuevo createSubscriptionCycle
       *  6.2 - Cambio de ciclo con prorrateo al final del ciclo
       *  se detecta: porqué el precio anterior es mayor al nuevo precio
       *  se hace: se espera al renew de la suscripción para actualizar el precio y crear un nuevo createSubscriptionCycle
       */

      // const createNewCycles = async () => {
      //   if(diferences.priceId){
      //     const prorationBillingMode = getProrationBillingMode({ oldSubPriceId: formattedOldSubscription.priceId, newSubPriceId: newSubscription.priceId })
      //     if(prorationBillingMode === 'prorated_immediately'){
      //       return true
      //     }
      //   }
      // }

      let createNewCycles = false;

      const subscriptionUpdateFields: Prisma.SubscriptionUpdateInput = {};

      if (diferences.priceId) {
        const prorationBillingMode = getProrationBillingMode({
          oldSubPriceId: formattedOldSubscription.priceId,
          newSubPriceId: newSubscription.priceId,
        });
        if (prorationBillingMode === "prorated_immediately") {
          createNewCycles = true;
          subscriptionUpdateFields["priceId"] = newSubscription.priceId;
        }
      }

      if (diferences.status) {
        subscriptionUpdateFields["status"] = newSubscription.status;
        createNewCycles = true;
      }

      if (diferences.scheduleChange) {
        subscriptionUpdateFields["scheduleChange"] =
          newSubscription.scheduleChange;
      }

      if (diferences.endBillingData && diferences.startBillingData) {
        subscriptionUpdateFields["endBillingData"] =
          newSubscription.endBillingData;
        subscriptionUpdateFields["startBillingData"] =
          newSubscription.startBillingData;
        createNewCycles = true;
      }

      const subscriptionUpdated = await updateSubscription(
        { id: body?.data.id },
        subscriptionUpdateFields,
      );

      if (createNewCycles) {
        const monthlyCylces = getMonthlyCycles(subscriptionUpdated);
        await createSubscriptionCycle(monthlyCylces);
      }

      if (!process.env.SLACK_URL_SUBSCRIPTION) {
        throw "SLACK_URL_SUBSCRIPTION is not defined";
      }

      await fetch(process.env.SLACK_URL_SUBSCRIPTION as string, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: JSON.stringify(
            {
              event: body?.event_type,
              teamId: body?.data?.custom_data?.teamId,
              subscriptionId: body?.data?.id,
              userId: body?.data?.custom_data?.userId,
              priceId: body.data.items[0].price.id,
            },
            null,
            2,
          ), // `null, 2` para formato legible en Slack
        }),
      });
    }

    if (body?.event_type === "subscription.created") {
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
            id: body?.data?.custom_data?.teamId || "",
          },
        },
        status: body?.data.status,
        priceId: body?.data.items[0].price.id,
        scheduleChange: body?.data.schedule_change,
        endBillingData: body?.data.next_billed_at,
        startBillingData: body?.data.first_billed_at,
      });

      const monthlyCylces = getMonthlyCycles(subscriptionCreated);

      await createSubscriptionCycle(monthlyCylces);

      if (!process.env.SLACK_URL_SUBSCRIPTION) {
        throw "SLACK_URL_SUBSCRIPTION is not defined";
      }
      await fetch(process.env.SLACK_URL_SUBSCRIPTION as string, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: JSON.stringify(
            {
              event: body?.event_type,
              teamId: body?.data?.custom_data?.teamId,
              subscriptionId: body?.data.id,
              userId: body?.data?.custom_data?.userId,
            },
            null,
            2,
          ),
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
