import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "#/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#/components/ui/tooltip"

export type Submission = {
  id: string
  form_id: string
  data: Record<string, any>
  created_at: number
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

  return [timeColumn, ...dataColumns]
}
