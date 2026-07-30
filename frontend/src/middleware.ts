export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/applications/:path*", "/resume/:path*", "/settings/:path*"],
};