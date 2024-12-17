"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import FullScreenLoader from "@/components/full-screen-loader";

const RedirectComponent = () => {
  const params = useParams();
  const router = useRouter();
  useEffect(() => {
    router.push(`${params.assistantId}/playground`);
  }, []);

  return <FullScreenLoader isLoading={true} />;
};

export default RedirectComponent;
