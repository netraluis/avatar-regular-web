// import Link from "next/link";
// import { notFound } from "next/navigation";
// import BlurImage from "@/components/blur-image";
// import { placeholderBlurhash, toDateString } from "@/lib/utils";
// import BlogCard from "@/components/blog-card";
// import { getPostsForSite, getSiteData } from "@/lib/fetchers";
// import Image from "next/image";

export async function generateStaticParams() {
  //   const allSites = await db.query.sites.findMany({
  //     // feel free to remove this filter if you want to generate paths for all sites
  //     where: (sites, { eq }) => eq(sites.subdomain, "demo"),
  //     columns: {
  //       subdomain: true,
  //       customDomain: true,
  //     },
  //   });

  //   const allPaths = allSites
  //     .flatMap(({ subdomain, customDomain }) => [
  //       subdomain && {
  //         domain: `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
  //       },
  //       customDomain && {
  //         domain: customDomain,
  //       },
  //     ])
  //     .filter(Boolean);

  return [{ domain: "demo.yoursite.com" }, { domain: "mycustomsite.com" }];
}

export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {
  // console.log('eeeee',params)
  const domain = decodeURIComponent(params.domain);
  console.log(domain);
  //   const [data, posts] = await Promise.all([
  //     getSiteData(domain),
  //     getPostsForSite(domain),
  //   ]);

  //   if (!data) {
  //     notFound();
  //   }

  return (
    <>
      <div className="mb-20 w-full">
        <>domain: {domain}</>
      </div>
    </>
  );
}
