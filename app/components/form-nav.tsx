import { Database, Puzzle, Settings } from "lucide-react"
import { NavLink, useParams } from "react-router"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "#/components/ui/sidebar"

export function FormNav() {
  const params = useParams()
  const formId = params.formId

  if (!formId) {
    return null
  }

  const items = [
    {
      title: "Submissions",
      url: `/forms/${formId}/submissions`,
      icon: Database,
    },
    {
      title: "Integration",
      url: `/forms/${formId}/integration`,
      icon: Puzzle,
    },
    {
      title: "Settings",
      url: `/forms/${formId}/settings`,
      icon: Settings,
    },
  ]

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink to={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
