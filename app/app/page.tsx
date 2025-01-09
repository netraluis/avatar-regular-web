"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/components/context/appContext";
import { useFetchTeamsByUserId } from "@/components/context/useAppContext/team";
import FullScreenLoader from "@/components/full-screen-loader";

const RedirectComponent = () => {
  const router = useRouter();
  const { fetchTeamsByUserId } = useFetchTeamsByUserId();
  const {
    state: { user },
  } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.user.id) {
          const response = await fetchTeamsByUserId({
            userId: user?.user.id,
            page: 1,
            pageSize: 4,
          });
          if (response && response?.teamSelected?.id) {
            router.push(`/team/${response.teamSelected.id}`);
          } else {
            router.push(`/team/new`);
          }
        } else {
          router.push(`/login`);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchData();
  }, [user?.user?.id]);

  return <FullScreenLoader isLoading={true} />;
};

export default RedirectComponent;
