import { useParams } from "react-router"

export default function SubmissionsPage() {
  const params = useParams()
  const formId = params.formId

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Submissions</h2>
        <p className="text-muted-foreground">
          View and manage form submissions for {formId}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Total Submissions</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">This Week</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">This Month</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-6 min-h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">No submissions yet</p>
      </div>
    </div>
  )
}
