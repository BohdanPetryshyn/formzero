import { useEffect, useState } from "react"
import { data, redirect, useFetcher, useLoaderData } from "react-router"
import type { Route } from "./+types/forms.$formId.settings"
import type { Form } from "#/types/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card"
import { Input } from "#/components/ui/input"
import { Label } from "#/components/ui/label"
import { Button } from "#/components/ui/button"
import { ResultButton } from "#/components/result-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { requireAuth } from "~/lib/require-auth.server"

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Settings | FormZero" },
    { name: "description", content: "Manage your form settings" },
  ]
}

export async function loader({ request, params, context }: Route.LoaderArgs) {
  const database = context.cloudflare.env.DB

  await requireAuth(request, database)

  const form = await database
    .prepare("SELECT id, name FROM forms WHERE id = ?")
    .bind(params.formId)
    .first<Form>()

  if (!form) {
    throw new Response("Form not found", { status: 404 })
  }

  return { form }
}

export async function action({ request, params, context }: Route.ActionArgs) {
  const database = context.cloudflare.env.DB

  await requireAuth(request, database)

  const { formId } = params

  if (request.method === "DELETE") {
    try {
      const result = await database
        .prepare("DELETE FROM forms WHERE id = ?")
        .bind(formId)
        .run()

      if (result.meta.changes === 0) {
        return data(
          { success: false, error: "Form not found" },
          { status: 404 }
        )
      }

      return redirect("/forms")
    } catch (error) {
      console.error("Error deleting form:", error)
      return data(
        { success: false, error: "Failed to delete form" },
        { status: 500 }
      )
    }
  }

  if (request.method !== "POST") {
    return data(
      { success: false, error: "Method not allowed" },
      { status: 405 }
    )
  }

  try {
    const formData = await request.formData()
    const name = (formData.get("name") as string | null)?.trim()

    if (!name) {
      return data(
        { success: false, error: "Form name is required" },
        { status: 400 }
      )
    }

    const result = await database
      .prepare("UPDATE forms SET name = ?, updated_at = ? WHERE id = ?")
      .bind(name, Date.now(), formId)
      .run()

    if (result.meta.changes === 0) {
      return data(
        { success: false, error: "Form not found" },
        { status: 404 }
      )
    }

    return data({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error updating form:", error)
    return data(
      { success: false, error: "Failed to update form" },
      { status: 500 }
    )
  }
}

export default function FormSettings() {
  const { form } = useLoaderData<typeof loader>()
  const updateFetcher = useFetcher<{ success?: boolean; error?: string }>()
  const deleteFetcher = useFetcher<{ success?: boolean; error?: string }>()

  const [name, setName] = useState(form.name)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [confirmText, setConfirmText] = useState("")

  useEffect(() => {
    setName(form.name)
  }, [form.name])

  const isSaving = updateFetcher.state === "submitting"
  const isSaved = updateFetcher.state === "idle" && updateFetcher.data?.success === true
  const updateError =
    updateFetcher.state === "idle" && updateFetcher.data?.error
      ? updateFetcher.data.error
      : null

  const isDeleting = deleteFetcher.state !== "idle"

  const handleDelete = () => {
    deleteFetcher.submit(null, {
      method: "delete",
      action: `/forms/${form.id}/settings`,
    })
  }

  const canSave = name.trim().length > 0 && name.trim() !== form.name

  return (
    <div className="flex flex-1 flex-col gap-4 min-w-0 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Form Name</CardTitle>
          <CardDescription>
            Used in the dashboard and in email notifications. Changing the name does not change
            the form&apos;s URL.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <updateFetcher.Form
            method="post"
            action={`/forms/${form.id}/settings`}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {updateError && (
                <p className="text-sm text-destructive">{updateError}</p>
              )}
            </div>
            <ResultButton
              type="submit"
              isSubmitting={isSaving}
              isSuccess={isSaved}
              loadingText="Saving..."
              successText="Saved!"
              disabled={!canSave}
            >
              Save
            </ResultButton>
          </updateFetcher.Form>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>
            Deleting this form permanently removes it and every submission it has received.
            This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={() => {
              setConfirmText("")
              setDeleteOpen(true)
            }}
          >
            Delete Form
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={deleteOpen}
        onOpenChange={(next) => !isDeleting && setDeleteOpen(next)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete &ldquo;{form.name}&rdquo;?</DialogTitle>
            <DialogDescription>
              This permanently removes the form and all of its submissions. Type the form name
              below to confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="confirm">Form name</Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={form.name}
              autoComplete="off"
            />
            {deleteFetcher.data?.error && (
              <p className="text-sm text-destructive">{deleteFetcher.data.error}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting || confirmText !== form.name}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Form"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
