import { redirect } from "react-router";
import type { Route } from "./+types/logout";
import { authClient } from "#/lib/auth.client";

export async function clientAction({ request }: Route.ClientActionArgs) {
  await authClient.signOut();
  return redirect("/login");
}
