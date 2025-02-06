export const getProrationBillingMode = ({
  oldSubPriceId,
  newSubPriceId,
}: {
  oldSubPriceId: string;
  newSubPriceId: string;
}) => {
  if (oldSubPriceId === process.env.HOBBY_PRICE_ID) {
    if (
      newSubPriceId === process.env.STANDARD_PRICE_ID ||
      newSubPriceId === process.env.UNLIMITED_PRICE_ID
    ) {
      return "prorated_immediately";
    }
  }

  if (oldSubPriceId === process.env.STANDARD_PRICE_ID) {
    if (newSubPriceId === process.env.HOBBY_PRICE_ID) {
      return "full_next_billing_period";
    }
    if (newSubPriceId === process.env.UNLIMITED_PRICE_ID) {
      return "prorated_immediately";
    }
  }

  if (oldSubPriceId === process.env.UNLIMITED_PRICE_ID) {
    if (newSubPriceId === process.env.HOBBY_PRICE_ID) {
      return "full_next_billing_period";
    }
    if (newSubPriceId === process.env.STANDARD_PRICE_ID) {
      return "full_next_billing_period";
    }
  }

  return null;
};
