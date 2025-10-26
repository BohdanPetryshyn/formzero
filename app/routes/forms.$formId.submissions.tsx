import { Link, useLoaderData } from "react-router"
import type { Route } from "./+types/forms.$formId.submissions"
import { createColumns } from "./forms.$formId.submissions/columns"
import type { Submission } from "./forms.$formId.submissions/columns"
import { DataTable } from "./forms.$formId.submissions/data-table"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "~/components/ui/empty"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Inbox, TrendingUp, TrendingDown } from "lucide-react"
import type { ChartConfig } from "~/components/ui/chart"

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
  const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000
  const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000
  const twoMonthsAgo = now - 60 * 24 * 60 * 60 * 1000

  const thisWeek = parsedSubmissions.filter(
    (s) => s.created_at >= oneWeekAgo
  ).length
  const previousWeek = parsedSubmissions.filter(
    (s) => s.created_at >= twoWeeksAgo && s.created_at < oneWeekAgo
  ).length
  const thisMonth = parsedSubmissions.filter(
    (s) => s.created_at >= oneMonthAgo
  ).length
  const previousMonth = parsedSubmissions.filter(
    (s) => s.created_at >= twoMonthsAgo && s.created_at < oneMonthAgo
  ).length

  // Calculate trends
  const weekTrend = previousWeek === 0
    ? (thisWeek > 0 ? 100 : 0)
    : Math.round(((thisWeek - previousWeek) / previousWeek) * 100)
  const monthTrend = previousMonth === 0
    ? (thisMonth > 0 ? 100 : 0)
    : Math.round(((thisMonth - previousMonth) / previousMonth) * 100)

  // Calculate daily submissions for the past 30 days
  const dailySubmissions: { date: string; count: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000)
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    const endOfDay = startOfDay + 24 * 60 * 60 * 1000

    const count = parsedSubmissions.filter(
      (s) => s.created_at >= startOfDay && s.created_at < endOfDay
    ).length

    dailySubmissions.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count,
    })
  }

  return {
    submissions: parsedSubmissions,
    stats: { total, thisWeek, thisMonth, weekTrend, monthTrend },
    chartData: dailySubmissions,
  }
}

const chartConfig = {
  count: {
    label: "Submissions",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export default function SubmissionsPage() {
  const { submissions, stats, chartData } = useLoaderData<typeof loader>()

  // Generate columns based on submission data
  const columns = createColumns(submissions)

  return (
    <div className="flex flex-1 flex-col gap-2 min-w-0">
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 min-w-0">
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total Submissions</h3>
          <p className="text-2xl font-bold mt-1">{stats.total}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground">This Week</h3>
          <div className="flex items-end gap-2 mt-1">
            <p className="text-2xl font-bold">{stats.thisWeek}</p>
            <div className={`flex items-center gap-1 text-xs font-medium pb-0.5 ${stats.weekTrend > 0 ? 'text-green-600 dark:text-green-500' : stats.weekTrend < 0 ? 'text-red-600 dark:text-red-500' : 'text-muted-foreground'}`}>
              {stats.weekTrend > 0 ? <TrendingUp className="h-3 w-3" /> : stats.weekTrend < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
              <span>{stats.weekTrend > 0 ? '+' : ''}{stats.weekTrend}%</span>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground">This Month</h3>
          <div className="flex items-end gap-2 mt-1">
            <p className="text-2xl font-bold">{stats.thisMonth}</p>
            <div className={`flex items-center gap-1 text-xs font-medium pb-0.5 ${stats.monthTrend > 0 ? 'text-green-600 dark:text-green-500' : stats.monthTrend < 0 ? 'text-red-600 dark:text-red-500' : 'text-muted-foreground'}`}>
              {stats.monthTrend > 0 ? <TrendingUp className="h-3 w-3" /> : stats.monthTrend < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
              <span>{stats.monthTrend > 0 ? '+' : ''}{stats.monthTrend}%</span>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Last 30 Days</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <ChartContainer config={chartConfig} className="h-[140px] w-full">
            <LineChart accessibilityLayer data={chartData} margin={{ left: -20, right: 10 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDecimals={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="linear"
                dataKey="count"
                stroke="var(--color-count)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {submissions.length === 0 ? (
        <div className="flex flex-1 items-center justify-center min-w-0 py-12">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Inbox className="h-10 w-10" />
              </EmptyMedia>
              <EmptyTitle>No submissions yet</EmptyTitle>
              <EmptyDescription>
                Get started by sendng your first submission to this form.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link to="../integration">Integrate</Link>
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <DataTable columns={columns} data={submissions} />
      )}
    </div>
  )
}
