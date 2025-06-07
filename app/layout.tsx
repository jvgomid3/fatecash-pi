import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AccessibilityPanel } from "@/components/accessibility-panel"
import { NavigationHelp } from "@/components/navigation-help"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Fatecash - Organização Financeira Pessoal",
  description: "Gerencie suas finanças pessoais de forma inteligente e organizada",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 overflow-auto">{children}</main>
          <AccessibilityPanel />
          <NavigationHelp />
        </SidebarProvider>
      </body>
    </html>
  )
}
