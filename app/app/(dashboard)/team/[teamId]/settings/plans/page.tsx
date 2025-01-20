"use client";
import { Check, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Environments, initializePaddle, Paddle } from "@paddle/paddle-js";
import { useEffect, useState } from "react";
import { useAppContext } from "@/components/context/appContext";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomPopup } from "@/components/custom-popup";
import { useUpdateTeam } from "@/components/context/useAppContext/team";

export default function Component() {
  // const { fetchTeamsByUserIdAndTeamId } = useFetchTeamsByUserIdAndTeamId()
  const { updateTeam } = useUpdateTeam();
  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     // const res = await fetch('/api/mi-endpoint-verificacion');
  //     // const data = await res.json();
  //     console.log('hola')
  //     if(!teamSelected?.id || !userLocal?.id) return
  //     fetchTeamsByUserIdAndTeamId(teamSelected?.id, userLocal?.id)
  //     // if (data.suscripcionActiva) {
  //     //   // Actualizas tu estado global / context / setState
  //     //   // Rediriges a la UI de "suscripción activa"
  //     //   clearInterval(interval);
  //     // }
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, []);

  const { t } = useDashboardLanguage();
  const texts = t("app.TEAM.TEAM_ID.SETTINGS.PLANS.PAGE");

  const [paddle, setPaddle] = useState<Paddle>();
  const [products, setProducts] = useState<any>();
  const [priceSubId, setPriceSubId] = useState<string>("");
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [loadingSubs, setLoadingSubs] = useState<boolean>(false);
  const [loadingHandlingCheckout, setLoadingHandlingCheckout] =
    useState<boolean>(false);

  const [cancelData, setCancelData] = useState<string>("");

  const [changeSubModal, setChangeSubModal] = useState<boolean>(false);
  const [modalPriceId, setModalPriceId] = useState<string | null>("");

  const fetchSubs = async () => {
    if (!teamSelected?.paddleSubscriptionId) return;
    if (teamSelected?.paddleSubscriptionId.startsWith("pri_")) {
      return setPriceSubId(teamSelected?.paddleSubscriptionId);
    }
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
      if (responseData?.scheduledChange?.action === "cancel") {
        setCancelData(
          new Date(
            responseData.scheduledChange.effectiveAt,
          ).toLocaleDateString(),
        );
      }
      setPriceSubId(responseData.items[0].price.id);
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
      // if (!teamSelected?.paddleSubscriptionId) return;
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
      userLocal?.id &&
      teamSelected?.id &&
      !paddle?.Initialized &&
      process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN &&
      process.env.NEXT_PUBLIC_PADDLE_ENV
    ) {
      initializePaddle({
        environment: "sandbox" as Environments,
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
        eventCallback: function async(data) {
          console.log("soy un callback", { data });
          console.log(userLocal?.language.toLocaleLowerCase());
          if (data && data.data && data.name === "checkout.completed") {
            //   updateTeam({ teamId: teamSelected?.id, data: { paddleSubscriptionId: data.data.items[0].price_id } });
            updateTeam(
              teamSelected?.id,
              { paddleSubscriptionId: data.data.items[0].price_id },
              userLocal?.id,
            );
            setPriceSubId(data.data.items[0].price_id);
          }
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

    // const hobbyTrialId = products.find(
    //   (product: any) => product.name === "hobbyTrial",
    // ).id;
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
      // case hobbyTrialId:
      //   setIndexActiveProd(0);
      //   break;
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
    console.log({ newCustomer });
    switch (index) {
      case 0:
        // return newCustomer
        //   ? products.find((product: any) => product.name === "hobbyTrial").id
        //   : products.find((product: any) => product.name === "hobby").id;
        return products.find((product: any) => product.name === "hobby").id;
      case 1:
        return products.find((product: any) => product.name === "standard").id;
      case 2:
        return products.find((product: any) => product.name === "unlimited").id;
      default:
        break;
    }
  };

  const openCheckout = async (index: number) => {
    try {
      if (cancelData || !userLocal) return;
      setLoadingHandlingCheckout(true);
      let userLocalIdCreated = undefined;

      // if userLocal (our user) doesn't have a paddleCustomerId we create one
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
        // console.log({ "responseData.id": responseData.id });
        userLocalIdCreated = responseData.id;

        await fetch(`/api/protected/user/${userLocal?.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: { paddleCustomerId: responseData.id },
          }),
        });
      }

      // we get the product by name that corresponds to the index
      const id = handleProductId(index, !userLocalIdCreated);
      if (!id) {
        throw new Error("Error: No product id");
      }

      // if the team doesn't have a subscription we open the checkout to create one
      if (!teamSelected?.paddleSubscriptionId) {
        paddle?.Checkout.open({
          items: [{ priceId: id, quantity: 1 }],
          customData: {
            userId: userLocal?.id,
            teamId: teamSelected?.id,
          },
          customer: {
            id: userLocalIdCreated
              ? userLocalIdCreated
              : userLocal?.paddleCustomerId,
          },
          settings: {
            allowLogout: false,
          },
        });
      } else {
        // this is to activate the change subscription modal
        setChangeSubModal(true);
        setModalPriceId(id);
      }
      setLoadingHandlingCheckout(false);
    } catch (e) {
      console.log({ e });
    }
  };

  const changeSubscription = async (priceId: string) => {
    if (!teamSelected?.id) return;
    const response = await fetch(
      `/api/protected/paddle/subscriptions/${teamSelected?.paddleSubscriptionId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          teamId: teamSelected.id,
        }),
      },
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    await fetchSubs();
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
      <CustomPopup
        title="Confirmación"
        description="¿Estás seguro de que quieres realizar esta acción?"
        open={changeSubModal}
        onOpenChange={setChangeSubModal}
        onAccept={() => {
          if (!modalPriceId) return;
          changeSubscription(modalPriceId);
        }}
        onCancel={() => {
          setModalPriceId(null);
        }}
      >
        {/* <p>Este es el contenido adicional del pop-up.</p> */}
      </CustomPopup>
      <div className="text-center mb-10">
        <div className="flex justify-center w-full space-x-3">
          <h1 className="text-3xl font-bold mb-2">{texts.title}</h1>

          {teamSelected?.paddleSubscriptionId && (
            <Button
              onClick={handleBillingPortal}
              className="text-lg space-x-2"
              disabled={!teamSelected?.paddleSubscriptionId?.startsWith("sub_")}
            >
              {teamSelected?.paddleSubscriptionId?.startsWith("sub_") && (
                <div>{texts.billingPortal}</div>
              )}
              {teamSelected?.paddleSubscriptionId?.startsWith("pri_") && (
                <div>Estamos procesando tu subscripciuon</div>
              )}
              <ExternalLink className="w-5 h-5" />
            </Button>
          )}
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
