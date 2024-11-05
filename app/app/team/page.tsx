"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useAppContext,
} from "@/components/context/appContext";
import { useFetchTeamsByUserId } from "@/components/context/useAppContext/team";

const RedirectComponent = () => {
  const router = useRouter();
  const { fetchTeamsByUserId } = useFetchTeamsByUserId();
  const {
    state: { user },
  } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.user?.id) {
          const response = await fetchTeamsByUserId(user?.user?.id);

          if (response?.teamSelected?.id) {
            router.push(`/team/${response.teamSelected.id}`);
          } else {
            router.push(`/team/new`);
          }
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchData();
  }, [user?.user?.id]);

  return <div>Loading...</div>;
};

export default RedirectComponent;
