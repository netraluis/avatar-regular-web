"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/loader";

const RedirectComponent = () => {
  const router = useRouter();
  useEffect(() => {
    router.push(`user/general`);
  }, []);

  return <Loader />;
};

export default RedirectComponent;
