"use client"

import { BarChart3, CreditCard, DollarSign, FileText, Home, Target, TrendingUp, Wallet } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Visão Geral",
    url: "/",
    icon: Home,
  },
  {
    title: "Metas",
    url: "/metas",
    icon: Target,
  },
  {
    title: "Meu Planejamento",
    url: "/planejamento",
    icon: FileText,
  },
  {
    title: "Minha Carteira",
    url: "/carteira",
    icon: Wallet,
  },
  {
    title: "Orçamento",
    url: "/orcamento",
    icon: BarChart3,
  },
  {
    title: "Dívidas",
    url: "/dividas",
    icon: TrendingUp,
  },
  {
    title: "Contas e Cartões",
    url: "/contas-cartoes",
    icon: CreditCard,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">
            <DollarSign className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Fatecash</h1>
            <p className="text-xs text-muted-foreground">Finanças Pessoais</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
