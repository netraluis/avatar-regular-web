"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import FullScreenLoader from "@/components/full-screen-loader";

const RedirectComponent = () => {
  const router = useRouter();
  useEffect(() => {
    router.push(`settings/general`);
  }, []);

  return <FullScreenLoader isLoading={true} />;
};

export default RedirectComponent;
