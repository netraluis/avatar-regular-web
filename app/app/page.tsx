"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useAppContext,
  useFetchTeamsByUserId,
} from "@/components/context/appContext";

const RedirectComponent = () => {
  const router = useRouter();
  const { fetchTeamsByUserId } = useFetchTeamsByUserId();
  const {
    state: { teamSelected, user },
  } = useAppContext();

  useEffect(() => {
    if (user?.id) {
      fetchTeamsByUserId(user?.id);
    }
  }, [user]);

  useEffect(() => {
    console.log({ teamSelected });
    if (teamSelected?.id) {
      return router.push(`/team/${teamSelected.id}`);
    }
    if (teamSelected && !teamSelected.id) {
      return router.push(`/team/new`);
    }
  }, [teamSelected]);

  return <div>Loading...</div>;
};

export default RedirectComponent;
