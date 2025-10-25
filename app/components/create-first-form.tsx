import { useFetcher } from "react-router"
import { FileText } from "lucide-react"
import { Button } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import { Label } from "#/components/ui/label"

export function CreateFirstForm() {
  const fetcher = useFetcher<{ error?: string }>()

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-primary text-primary-foreground flex aspect-square size-16 items-center justify-center rounded-2xl">
            <FileText className="size-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome to FormZero
            </h1>
            <p className="text-muted-foreground text-lg">
              Create your first form to start collecting submissions
            </p>
          </div>
        </div>

        <fetcher.Form method="post" action="/forms" className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">
                Form Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Contact Form"
                required
                className="h-12 text-base"
                autoFocus
              />
              {fetcher.data && "error" in fetcher.data && (
                <p className="text-sm text-destructive">
                  {fetcher.data.error as string}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={fetcher.state === "submitting"}
            className="w-full h-12 text-base"
            size="lg"
          >
            {fetcher.state === "submitting" ? "Creating..." : "Create Form"}
          </Button>
        </fetcher.Form>
      </div>
    </div>
  )
}
