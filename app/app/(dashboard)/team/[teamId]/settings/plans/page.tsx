"use client";
import { Check, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Environments, initializePaddle, Paddle } from "@paddle/paddle-js";
import { useEffect, useState } from "react";
import { useAppContext } from "@/components/context/appContext";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateUser } from "@/lib/data/user";

export default function Component() {
  const { t } = useDashboardLanguage();
  const texts = t("app.TEAM.TEAM_ID.SETTINGS.PLANS.PAGE");

  const [paddle, setPaddle] = useState<Paddle>();
  const [products, setProducts] = useState<any>();
  const [priceSubId, setSubId] = useState<string>("");
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [loadingSubs, setLoadingSubs] = useState<boolean>(false);
  const [loadingHandlingCheckout, setLoadingHandlingCheckout] =
    useState<boolean>(false);

  const [cancelData, setCancelData] = useState<string>("");

  const fetchSubs = async () => {
    if (!teamSelected?.paddleSubscriptionId) return;
    setLoadingSubs(true);

    try {
      const response = await fetch(
        `/api/protected/paddle/subscriptions/${teamSelected?.paddleSubscriptionId}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const responseData = await response.json();
      if (responseData.canceledAt) return;
      if (responseData.scheduledChange.action === "cancel") {
        setCancelData(
          new Date(
            responseData.scheduledChange.effectiveAt,
          ).toLocaleDateString(),
        );
      }
      setSubId(responseData.items[0].price.id);
    } catch (e: any) {
      console.log({ e });
    } finally {
      setLoadingSubs(false);
    }
  };

  const {
    state: { userLocal, teamSelected },
  } = useAppContext();

  const [indexActiveProd, setIndexActiveProd] = useState<number>(-1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!teamSelected?.paddleSubscriptionId) return;
      setLoadingProducts(true);
      try {
        const response = await fetch(`/api/protected/paddle/products`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const responseData = await response.json();
        setProducts(responseData);
      } catch (e: any) {
        console.log({ e });
      } finally {
        setLoadingProducts(false);
      }
    };
    if (
      !paddle?.Initialized &&
      process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN &&
      process.env.NEXT_PUBLIC_PADDLE_ENV
    ) {
      initializePaddle({
        environment: "sandbox" as Environments,
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
        eventCallback: function (data) {
          console.log(data);
          console.log(userLocal?.language.toLocaleLowerCase());
        },
        checkout: {
          settings: {
            locale: `${userLocal?.language.toLocaleLowerCase() === "ca" ? "es" : userLocal?.language.toLocaleLowerCase() || "es"}`,
          },
        },
      }).then((paddleInstance: Paddle | undefined) => {
        if (paddleInstance) {
          setPaddle(paddleInstance);
        }
      });
    }

    fetchProduct();
  }, [teamSelected?.paddleSubscriptionId]);

  useEffect(() => {
    fetchSubs();
  }, [teamSelected]);

  useEffect(() => {
    if (!products || !priceSubId) return;

    const hobbyTrialId = products.find(
      (product: any) => product.name === "hobbyTrial",
    ).id;
    const hobbyPriceId = products.find(
      (product: any) => product.name === "hobby",
    ).id;
    const standardPriceId = products.find(
      (product: any) => product.name === "standard",
    ).id;
    const unlimitedPriceId = products.find(
      (product: any) => product.name === "unlimited",
    ).id;

    switch (priceSubId) {
      case hobbyTrialId:
        setIndexActiveProd(0);
        break;
      case hobbyPriceId:
        setIndexActiveProd(0);
        break;
      case standardPriceId:
        setIndexActiveProd(1);
        break;
      case unlimitedPriceId:
        setIndexActiveProd(2);
        break;
      default:
        break;
    }
  }, [products, priceSubId]);

  const handleProductId = (index: number, newCustomer?: boolean) => {
    switch (index) {
      case 0:
        return newCustomer
          ? products.find((product: any) => product.name === "hobbyTrial").id
          : products.find((product: any) => product.name === "hobby").id;
      case 1:
        return products.find((product: any) => product.name === "standard").id;
      case 2:
        return products.find((product: any) => product.name === "unlimited").id;
      default:
        break;
    }
  };

  const openCheckout = async (index: number) => {
    if (cancelData || !userLocal) return;
    setLoadingHandlingCheckout(true);
    let userLocalIdCreated = undefined;
    if (!userLocal?.paddleCustomerId) {
      const response = await fetch(`/api/protected/paddle/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userLocal?.email,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const responseData = await response.json();
      userLocalIdCreated = responseData.data.id;
      updateUser({
        userId: userLocal?.id,
        data: { paddleCustomerId: responseData.data.id },
      });
    }

    const id = handleProductId(index, !userLocalIdCreated);
    if (!id) return;
    if (!teamSelected?.paddleSubscriptionId) {
      paddle?.Checkout.open({
        // ...(userLocal?.email && { customer: { email: userLocal.email } }),
        items: [{ priceId: id, quantity: 1 }],
        customData: {
          userId: userLocal?.id, // Datos personalizados
          teamId: teamSelected?.id, // Otra información relevante
        },
        customer: {
          id: userLocalIdCreated
            ? userLocalIdCreated
            : userLocal?.paddleCustomerId,
        },
      });
    } else {
      const response = await fetch(
        `/api/protected/paddle/subscriptions/${teamSelected?.paddleSubscriptionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            priceId: id,
          }),
        },
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      await fetchSubs();
    }
    setLoadingHandlingCheckout(false);
  };

  const handleBillingPortal = async () => {
    const response = await fetch(
      `/api/protected/paddle/customers/${userLocal?.paddleCustomerId}/portal-sessions`,
      {
        method: "POST",
        body: JSON.stringify({
          subscription_ids: [teamSelected?.paddleSubscriptionId],
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const responseData = await response.json();
    const originalUrl = responseData.data.urls.general.overview;
    const cplMatch = originalUrl.match(/\/cpl_[^/]+/);
    const cpl = cplMatch ? cplMatch[0] : "";
    const newUrl = `https://sandbox-customer-portal.paddle.com/subscriptions/${teamSelected?.paddleSubscriptionId}${cpl}`;
    window.open(newUrl, "_blank");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="flex justify-center w-full space-x-3">
          <h1 className="text-3xl font-bold mb-2">{texts.title}</h1>
          <Button onClick={handleBillingPortal} className="text-lg space-x-2">
            <div>{texts.billingPortal}</div>
            <ExternalLink className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-muted-foreground">{texts.description}</p>
      </div>
      {!loadingProducts && !loadingSubs && !loadingHandlingCheckout && (
        <div className="grid md:grid-cols-3 gap-8">
          {texts.plans.map((plan: any, index: number) => {
            return (
              <Card
                key={index}
                onClick={() => openCheckout(index)}
                className={`${indexActiveProd === index ? "border bg-gray-100" : !cancelData && "cursor-pointer"}`}
              >
                <CardHeader className="space-y-1">
                  {cancelData && indexActiveProd === index && (
                    <span className="text-red-500">
                      Se cancelara en {cancelData}
                    </span>
                  )}
                  <div className="flex">
                    <CardTitle>{plan.title}</CardTitle>
                    <span>
                      <Badge
                        variant="outline"
                        className="px-1.5 py-0 leading-4 ml-2"
                      >
                        {indexActiveProd === index
                          ? texts.currentPlan
                          : texts.changePlan}
                      </Badge>
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-4xl font-bold">{plan.price} €</span>
                    <span className="text-sm text-muted-foreground">
                      {plan.monthly}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="h-full">
                  <div className="h-full flex flex-col">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {plan.includedPlus}
                      </div>
                      <ul className="space-y-2.5 pt-4">
                        {plan.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
