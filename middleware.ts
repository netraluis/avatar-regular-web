// import { type NextRequest } from "next/server";
// import { updateSession } from "@/lib/supabase/middleware";

// export async function middleware(request: NextRequest) {
//   // update user's auth session
//   return await updateSession(request);
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * Feel free to modify this pattern to include more paths.
//      */
//     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// };

import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const pattern =
  /\/((?!_next\/static|_next\/image|favicon\.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)/;

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  console.log("middleware");
  const url = req.nextUrl;
  if (pattern.test(url.toString())) {
    await updateSession(req);
  }

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  let hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  console.log("hostname0", hostname);

  // special case for Vercel preview deployment URLs
  if (
    hostname.includes("---") &&
    hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
  ) {
    hostname = `${hostname.split("---")[0]}.${
      process.env.NEXT_PUBLIC_ROOT_DOMAIN
    }`;
  }

  console.log("hostname1", hostname);

  const searchParams = req.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  // rewrites for app pages
  // if (hostname == `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
  //   const session = await getToken({ req });
  //   if (!session && path !== "/login") {
  //     return NextResponse.redirect(new URL("/login", req.url));
  //   } else if (session && path == "/login") {
  //     return NextResponse.redirect(new URL("/", req.url));
  //   }
  //   return NextResponse.rewrite(
  //     new URL(`/app${path === "/" ? "" : path}`, req.url),
  //   );
  // }

  // special case for `vercel.pub` domain
  // if (hostname === "vercel.pub") {
  //   return NextResponse.redirect(
  //     "https://vercel.com/blog/platforms-starter-kit",
  //   );
  // }

  // rewrite root application to `/home` folder
  console.log("hostname2", hostname);
  if (
    hostname === "localhost:3000" ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    // return NextResponse.rewrite(
    //   new URL(`/home${path === "/" ? "" : path}`, req.url),
    // );
    return;
  }

  if (process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
    let normalizedDomain = hostname.split(
      `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
    );
    console.log("normalizedDomain", normalizedDomain);

    // rewrite everything else to `/[domain]/[slug] dynamic route
    return NextResponse.rewrite(
      new URL(`/${normalizedDomain[0]}${path}`, req.url),
    );
  }
}
