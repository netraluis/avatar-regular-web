import { Prisma, Subscription } from "@prisma/client";

/**
 * Convierte una Date de JS a un string ISO con 6 decimales, p.ej.
 * "2024-04-09T07:23:10.921392Z"
 */
function toIso6Decimals(date: Date) {
  // toISOString() produce algo como "2024-04-09T07:23:10.921Z" (3 decimales)
  const iso = date.toISOString();
  // Separamos fecha-hora de los milisegundos
  const [fechaHora, fracZ] = iso.split(".");
  // fracZ luce como "921Z" (3 dígitos + "Z")
  const msSinZ = fracZ.replace("Z", ""); // "921"

  // Rellenamos hasta 6 dígitos: "921" -> "921000"
  const ms6 = msSinZ.padEnd(6, "0");

  return `${fechaHora}.${ms6}Z`;
}

/**
 * Suma exactamente 1 mes a la fecha dada,
 * intentando mantener el mismo "día".
 * Si el siguiente mes no tiene ese día,
 * se ajusta al último día de dicho mes.
 *
 * @param {Date} date - La fecha original.
 * @returns {Date} - Nueva fecha (clon) con un mes más.
 */
function addMonthPreservingDay(date: Date) {
  // Clonamos la fecha para no mutar el original
  let newDate = new Date(date);

  const originalDay = newDate.getDate(); // día de 1..31

  // Sumamos 1 mes
  newDate.setMonth(newDate.getMonth() + 1);

  // Si el día cambió, significa que el mes no tenía ese día
  if (newDate.getDate() !== originalDay) {
    const year = newDate.getFullYear();
    const month = newDate.getMonth();
    // Día 0 del próximo mes => último día del mes actual
    newDate = new Date(year, month + 1, 0);
  }

  return newDate;
}

/**
 * Genera un array de ciclos mensuales, donde cada ciclo
 * es un objeto con { startOfCycle, endOfCycle },
 * en formato ISO con 6 decimales.
 *
 * @param {Date} startDate - Fecha inicial (primer ciclo).
 * @param {Date} endDate   - Fecha tope para cerrar ciclos.
 * @returns {Array<{startOfCycle: string, endOfCycle: string}>}
 * (alias) type Subscription = {
    id: string;
    teamId: string;
    status: string;
    priceId: string;
    scheduleChange: Date;
    endBillingData: Date;
    startBillingData: Date;
    createdAt: Date;
    updatedAt: Date;
}
 */
export function getMonthlyCycles(
  subscription: Subscription,
): Prisma.SubscriptionCycleCreateManyInput[] {
  // Aseguramos copias de las fechas para evitar mutar los objetos originales
  let currentStart = new Date(subscription.startBillingData);
  const lastDate = new Date(subscription.endBillingData);

  const cycles = [];

  while (currentStart < lastDate) {
    // Calculamos el próximo "inicio"
    const nextStart = addMonthPreservingDay(currentStart);

    // El endOfCycle será justo antes del nextStart,
    // o el endDate si nextStart se va más allá del endDate.
    let currentEnd = new Date(nextStart.getTime() - 1); // 1 ms antes
    if (currentEnd > lastDate) {
      // Si el “próximo inicio” ya pasa el endDate,
      // el ciclo actual acaba el mismo endDate.
      currentEnd = lastDate;
    }

    let maxCredits = 0;
    switch (subscription.priceId) {
      case process.env.HOBBY_PRICE_ID:
        maxCredits = Number(process.env.TOKEN_MAX_HOBBY) || 0;
        break;
      case process.env.STANDARD_PRICE_ID:
        maxCredits = Number(process.env.TOKEN_MAX_STANDARD) || 0;
        break;
      case process.env.UNLIMITED_PRICE_ID:
        maxCredits = Number(process.env.TOKEN_MAX_UNLIMITED) || 0;
        break;
      default:
        break;
    }

    cycles.push({
      subscriptionId: subscription.id,
      maxCredits: maxCredits, // or any appropriate value
      extraCredits: 0, // or any appropriate value
      startOfCycle: toIso6Decimals(currentStart),
      endOfCycle: toIso6Decimals(currentEnd),
      status: subscription.status, // or any appropriate value
      priceId: subscription.priceId, // or any appropriate value
    });

    // Avanzamos al siguiente ciclo
    if (nextStart > lastDate) {
      // Si ya rebasamos la fecha final, salimos
      break;
    }
    currentStart = nextStart;
  }

  return cycles;
}
