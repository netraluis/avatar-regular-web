"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const RedirectComponent = () => {
  const router = useRouter();
  useEffect(() => {
    router.push(`settings/general`);
  }, []);

  return <div>Loading..</div>;
};

export default RedirectComponent;
