import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { Empty } from "./lib/data/domain";

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
  const url = req.nextUrl;
  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  let hostname = req.headers.get("host")!;
  // special case for Vercel preview deployment URLs
  if (
    hostname.includes("---") &&
    hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
  ) {
    hostname = `${hostname.split("---")[0]}.${
      process.env.NEXT_PUBLIC_ROOT_DOMAIN
    }`;
  }

  const searchParams = req.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  const newUrl =
    hostname === `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` ||
    hostname === process.env.NEXT_PUBLIC_VERCEL_URL
      ? new URL(`/app${path}`, req.url)
      : new URL(`/${hostname}${path}`, req.url);

  if (
    pattern.test(url.toString()) &&
    hostname === `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  ) {
    const response = await updateSession(req);
    // Verificar si la respuesta indica una redirección (status 3xx)
    if (response.status >= 300 && response.status < 400) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const rewrittenResponse = NextResponse.rewrite(newUrl);

    // Copiar los headers de la respuesta de sesión al nuevo objeto de respuesta
    rewrittenResponse.headers.set(
      "x-user-id",
      response.headers.get("x-user-id") || "",
    );
    return rewrittenResponse;
  }

  if (pattern.test(url.toString()) && !hostname.startsWith("app.")) {
    console.log("entro", { hostname, url });
    const { pathname } = url;
    console.log({ pathname });
    const pathSegments = pathname.split("/").filter((segment) => segment);
    if (!pathSegments[0]) {
      const newUrl = new URL(`/${hostname}/${Empty.EMPTY}`, req.url);
      return NextResponse.rewrite(newUrl);
    }
  }

  return NextResponse.rewrite(newUrl);
}
