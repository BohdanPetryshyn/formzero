import type { Form } from "#/types/form"
import type { User } from "#/types/user"
import { FormSwitcher } from "#/components/form-switcher"
import { FormNav } from "#/components/form-nav"
import { LogOut, MoreHorizontal } from "lucide-react"
import { useFetcher } from "react-router"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"

type AppSidebarProps = {
  forms: Form[]
  user: User
} & React.ComponentProps<typeof Sidebar>

export function AppSidebar({ forms, user, ...props }: AppSidebarProps) {
  const userInitial = user.name.charAt(0).toUpperCase()
  const fetcher = useFetcher()

  const handleLogout = () => {
    fetcher.submit(null, { method: "post", action: "/logout" })
  }

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg font-semibold">
                    {userInitial}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                  </div>
                  <MoreHorizontal className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
