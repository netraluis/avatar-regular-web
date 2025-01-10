"use client";

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

  return <>{children}</>;
}
