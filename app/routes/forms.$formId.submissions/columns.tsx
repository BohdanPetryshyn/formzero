import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { useFetcher } from "react-router"
import { ArrowUpDown, Trash2, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "#/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog"

export type Submission = {
  id: string
  form_id: string
  data: Record<string, any>
  created_at: number
}

function DeleteSubmissionButton({ submission }: { submission: Submission }) {
  const fetcher = useFetcher()
  const [open, setOpen] = useState(false)
  const isDeleting = fetcher.state !== "idle"

  const handleDelete = () => {
    fetcher.submit(null, {
      method: "delete",
      action: `/forms/${submission.form_id}/submissions/${submission.id}`,
    })
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={() => setOpen(true)}
        aria-label="Delete submission"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <Dialog open={open} onOpenChange={(next) => !isDeleting && setOpen(next)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete submission?</DialogTitle>
            <DialogDescription>
              This permanently removes the submission and its data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function createColumns(submissions: Submission[]): ColumnDef<Submission>[] {
  // Time column comes first
  const timeColumn: ColumnDef<Submission> = {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const timestamp = row.getValue("created_at") as number
      const date = new Date(timestamp)
      const relativeTime = formatDistanceToNow(date, {
        addSuffix: true,
      })
      const exactTime = date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "medium",
      })
      return (
        <TooltipProvider delayDuration={1000}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-sm text-muted-foreground">
                {relativeTime}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{exactTime}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  }

  // Extract all unique field names from submission data
  const fieldNames = new Set<string>()
  submissions.forEach((submission) => {
    Object.keys(submission.data).forEach((key) => fieldNames.add(key))
  })

  // Sort field names: email first if exists, then alphabetically
  const sortedFields = Array.from(fieldNames).sort((a, b) => {
    if (a === "email") return -1
    if (b === "email") return 1
    return a.localeCompare(b)
  })

  // Create columns for each field
  const dataColumns: ColumnDef<Submission>[] = sortedFields.map((fieldName) => {
    // Make email column sortable
    if (fieldName === "email") {
      return {
        id: fieldName,
        accessorFn: (row) => row.data[fieldName],
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Email
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          const value = row.original.data[fieldName]
          return <div className="text-sm">{value?.toString() || ""}</div>
        },
      }
    }

    // Regular columns
    return {
      id: fieldName,
      accessorFn: (row) => row.data[fieldName],
      header: fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
      cell: ({ row }) => {
        const value = row.original.data[fieldName]
        return <div className="text-sm">{value?.toString() || ""}</div>
      },
    }
  })

  const actionsColumn: ColumnDef<Submission> = {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <DeleteSubmissionButton submission={row.original} />
      </div>
    ),
  }

  return [timeColumn, ...dataColumns, actionsColumn]
}
