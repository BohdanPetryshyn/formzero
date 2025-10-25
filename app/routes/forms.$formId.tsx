import type { Route } from "./+types/forms.$formId"
import { Outlet, redirect, useLoaderData, useLocation, useParams } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "#/components/ui/breadcrumb"
import { Separator } from "#/components/ui/separator"
import {
  SidebarTrigger,
} from "#/components/ui/sidebar"
import type { Form } from "#/types/form";

export async function loader({ context, params, request }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB

  // Fetch form details
  const result = await db
    .prepare("SELECT id, name FROM forms WHERE id = ?")
    .bind(params.formId)
    .first()

  // If we're at exactly /forms/:formId (with or without trailing slash), redirect to submissions
  const url = new URL(request.url)
  const pathname = url.pathname.replace(/\/$/, "") // Remove trailing slash
  if (pathname === `/forms/${params.formId}`) {
    return redirect(`/forms/${params.formId}/submissions`)
  }

  return {
    form: result as Form
  }
}

export default function FormLayout() {
  const params = useParams()
  const loaderData = useLoaderData<typeof loader>()

  const location = useLocation()

  const pathSegments = location.pathname.split("/").filter(Boolean)
  const currentPage = pathSegments[pathSegments.length - 1];
  const pageTitle = currentPage.charAt(0).toUpperCase() + currentPage.slice(1)

  return (<>
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/">
                FormZero
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={`/forms/${params.formId}/submissions`}>
                {loaderData.form.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 min-w-0">
      <Outlet />
    </div>
  </>
  )
}