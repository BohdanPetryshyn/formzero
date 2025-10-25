import * as React from "react"
import { ChevronsUpDown, FileText, Plus } from "lucide-react"
import { useFetcher, useLocation, useNavigate, useParams } from "react-router"
import type { Form } from "#/types/form"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "#/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog"
import { Input } from "#/components/ui/input"
import { Label } from "#/components/ui/label"
import { Button } from "#/components/ui/button"

type FormSwitcherProps = {
  forms: Form[]
}

export function FormSwitcher({ forms }: FormSwitcherProps) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const params = useParams()
  const formId = params.formId || forms[0].id
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const fetcher = useFetcher<{ error?: string }>()
  const location = useLocation();

  const activeForm = forms.find((form) => form.id === formId) || forms[0]

  // Close dialog on successful submission
  React.useEffect(() => {
    setIsDialogOpen(false)
  }, [location.pathname])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <FileText className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeForm.name}</span>
                <span className="truncate text-xs">{activeForm.id}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Forms
            </DropdownMenuLabel>
            {forms.map((form) => (
              <DropdownMenuItem
                key={form.id}
                onClick={() => navigate(`/forms/${form.id}/submissions`)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <FileText className="size-3.5 shrink-0" />
                </div>
                {form.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onSelect={() => setIsDialogOpen(true)}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add form</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Form</DialogTitle>
            <DialogDescription>
              Create a new form to start collecting submissions.
            </DialogDescription>
          </DialogHeader>
          <fetcher.Form method="post" action="/forms">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Form Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Contact Form"
                  required
                />
                {fetcher.data && "error" in fetcher.data && (
                  <p className="text-sm text-destructive">{fetcher.data.error as string}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={fetcher.state === "submitting"}>
                {fetcher.state === "submitting" ? "Creating..." : "Create Form"}
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </DialogContent>
      </Dialog>
    </SidebarMenu>
  )
}
