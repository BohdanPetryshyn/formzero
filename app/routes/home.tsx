import { redirect } from "react-router"
import type { Route } from "./+types/home"

// Redirect from / to /forms
export function loader({ context }: Route.LoaderArgs) {
  return redirect("/forms")
}
