import { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response(null, {
    status: 302,
    headers: {
      Location: "/"
    }
  });

  response.headers.append(
    "Set-Cookie",
    "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax" + 
    (process.env.NODE_ENV === "production" ? "; Secure" : "") // Secure in production
  );

  return response;
}