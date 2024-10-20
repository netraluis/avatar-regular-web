"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const RedirectComponent = () => {
  const params = useParams();
  const router = useRouter();
  useEffect(() => {
    router.push(`${params.assistantId}/playground`);
  }, []);
  
  return <div>Loading..</div>;
};

export default RedirectComponent;
