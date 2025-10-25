import { useLoaderData } from "react-router"
import type { Route } from "./+types/forms.$formId.submissions"
import { createColumns } from "./forms.$formId.submissions/columns"
import type { Submission } from "./forms.$formId.submissions/columns"
import { DataTable } from "./forms.$formId.submissions/data-table"

export async function loader({ params, context }: Route.LoaderArgs) {
  const { formId } = params
  const db = context.cloudflare.env.DB

  // Fetch all submissions for this form
  const submissions = await db
    .prepare(
      "SELECT id, form_id, data, created_at FROM submissions WHERE form_id = ? ORDER BY created_at DESC"
    )
    .bind(formId)
    .all()

  // Parse the JSON data field for each submission
  const parsedSubmissions: Submission[] = submissions.results.map((row: any) => ({
    id: row.id,
    form_id: row.form_id,
    data: JSON.parse(row.data),
    created_at: row.created_at,
  }))

  // Calculate stats
  const total = parsedSubmissions.length
  const now = Date.now()
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000
  const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000

  const thisWeek = parsedSubmissions.filter(
    (s) => s.created_at >= oneWeekAgo
  ).length
  const thisMonth = parsedSubmissions.filter(
    (s) => s.created_at >= oneMonthAgo
  ).length

  return {
    submissions: parsedSubmissions,
    stats: { total, thisWeek, thisMonth },
  }
}

export default function SubmissionsPage() {
  const { submissions, stats } = useLoaderData<typeof loader>()

  // Generate columns based on submission data
  const columns = createColumns(submissions)

  return (
    <div className="flex flex-1 flex-col gap-4 min-w-0">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 min-w-0">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Total Submissions</h3>
          <p className="text-3xl font-bold mt-2">{stats.total}</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">This Week</h3>
          <p className="text-3xl font-bold mt-2">{stats.thisWeek}</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">This Month</h3>
          <p className="text-3xl font-bold mt-2">{stats.thisMonth}</p>
        </div>
      </div>
      <DataTable columns={columns} data={submissions} />
    </div>
  )
}
