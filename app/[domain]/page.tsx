"use server";
// import Link from "next/link";
// import { notFound } from "next/navigation";
// import BlurImage from "@/components/blur-image";
// import { placeholderBlurhash, toDateString } from "@/lib/utils";
// import BlogCard from "@/components/blog-card";
// import { getPostsForSite, getDomainData } from "@/lib/fetchers";
// import Image from "next/image";
import ConversationSwitcher from "@/components/conversationSwitcher";

export async function generateStaticParams() {
  return [{ domain: "demo.yoursite.com" }, { domain: "mycustomsite.com" }];
}

export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {
  const domain = decodeURIComponent(params.domain);
  //   const [data, posts] = await Promise.all([
  //     getDomainData(domain),
  //     getPostsForSite(domain),
  //   ]);

  //   if (!data) {
  //     notFound();
  //   }

  return <ConversationSwitcher />;
}
