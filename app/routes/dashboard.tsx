import { redirect } from "react-router"
import type { Route } from "./+types/dashboard"

export function loader({}: Route.LoaderArgs) {
  return redirect("/forms/my-contact-form/submissions")
}

export default function Dashboard() {
  return null
}
