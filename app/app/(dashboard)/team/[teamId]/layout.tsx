"use client";
import { useEffect } from "react";
import { useFetchTeamsByUserIdAndTeamId } from "@/components/context/useAppContext/team";
import { useAppContext } from "@/components/context/appContext";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const router = useRouter();
  // const params = useParams()
  // const {teamId} = params
  // const {
  //   state: { teamSelected},
  // } = useAppContext();

  // useEffect(() => {
  //   if (!teamSelected) return
  //   console.log({ teamSelected })
  //   if (!teamSelected.paddleSubscriptionId) {
  //     return router.push(`/team/${teamId}/settings/plans`);
  //   }
  // }, [teamSelected])

  // if (!teamSelected?.paddleSubscriptionId) return <></>

  // const {state: { userLocal }} = useAppContext();

  const {
    state: { userLocal, teamSelected },
  } = useAppContext();

  const { fetchTeamsByUserIdAndTeamId } = useFetchTeamsByUserIdAndTeamId();

  useEffect(() => {
    const interval = setInterval(async () => {
      // const res = await fetch('/api/mi-endpoint-verificacion');
      // const data = await res.json();
      if (!teamSelected?.id || !userLocal?.id) return;
      if (
        !teamSelected.paddleSubscriptionId ||
        teamSelected.paddleSubscriptionId?.startsWith("sub_")
      ) {
        console.log("entro");
        // Actualizas tu estado global / context / setState
        // Rediriges a la UI de "suscripción activa"
        clearInterval(interval);
        return;
      }
      console.log("hola");

      fetchTeamsByUserIdAndTeamId(teamSelected?.id, userLocal?.id);
    }, 3000);

    return () => clearInterval(interval);
  }, [teamSelected?.paddleSubscriptionId]);

  return <>{children}</>;
}
