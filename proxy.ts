import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_EMAILS = ["kolikahmet@gmail.com", "info@kolikshop.com"];
const ADMIN_PREFIXES = ["/dashboard", "/products", "/sales", "/customers", "/settings"];

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = ADMIN_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (isAdminRoute && !ADMIN_EMAILS.includes(user.email ?? "")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/products/:path*",
    "/sales/:path*",
    "/customers/:path*",
    "/settings/:path*",
    "/account",
    "/account/:path*",
  ],
};
