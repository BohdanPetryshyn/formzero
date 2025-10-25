import { Outlet, redirect, useLoaderData } from "react-router"
import type { Route } from "./+types/forms"
import type { Form } from "#/types/form"
import { AppSidebar } from "#/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "#/components/ui/sidebar"
import { CreateFirstForm } from "#/components/create-first-form"

export async function loader({ context, request }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB

  // Fetch all forms
  const result = await db
    .prepare("SELECT id, name FROM forms ORDER BY created_at DESC")
    .all()

  const forms = result.results as Form[]

  // If we're at exactly /forms (with or without trailing slash) and forms exist, redirect to first form's submissions
  const url = new URL(request.url)
  const pathname = url.pathname.replace(/\/$/, "") // Remove trailing slash
  if (pathname === "/forms" && forms.length > 0) {
    return redirect(`/forms/${forms[0].id}/submissions`)
  }

  return { forms }
}

export async function action({ request, context }: Route.ActionArgs) {
  const db = context.cloudflare.env.DB
  const formData = await request.formData()

  const name = formData.get("name") as string

  if (!name) {
    return { error: "Form name is required" }
  }

  // Generate a slug from the form name
  const id = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  // Check if form with this ID already exists
  const existing = await db
    .prepare("SELECT id FROM forms WHERE id = ?")
    .bind(id)
    .first()

  if (existing) {
    return { error: "A form with this name already exists" }
  }

  const createdAt = Date.now()

  await db
    .prepare(
      "INSERT INTO forms (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)"
    )
    .bind(id, name, createdAt, createdAt)
    .run()

  return redirect(`/forms/${id}/submissions`)
}

export default function Forms() {
  const { forms } = useLoaderData<typeof loader>()

  // Show empty state when there are no forms
  if (forms.length === 0) {
    return <CreateFirstForm />
  }

  return (
    <SidebarProvider>
      <AppSidebar forms={forms} />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
