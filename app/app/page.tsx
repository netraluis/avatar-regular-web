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
    if (user?.user?.id) {
      fetchTeamsByUserId(user.user.id);
    }
  }, [user.user.id]);

  useEffect(() => {
    if (teamSelected?.id) {
      return router.push(`/team/${teamSelected.id}`);
    } else {
      return router.push(`/team/new`);
    }
  }, [teamSelected]);

  return <div>Loading...</div>;
};

export default RedirectComponent;
