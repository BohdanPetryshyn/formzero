import { FileText } from "lucide-react"
import type { Form } from "#/types/form"
import { FormSwitcher } from "#/components/form-switcher"
import { FormNav } from "#/components/form-nav"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "#/components/ui/sidebar"

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  forms: Form[]
}

export function AppSidebar({ forms, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <FormSwitcher forms={forms} />
      </SidebarHeader>
      <SidebarContent>
        <FormNav />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <FileText className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">OpenForm</span>
                <span className="truncate text-xs text-muted-foreground">Form Backend</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
