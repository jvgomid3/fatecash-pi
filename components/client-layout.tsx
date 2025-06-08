"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AccessibilityPanel } from "@/components/accessibility-panel";
import { NavigationHelp } from "@/components/navigation-help";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideSidebar =
    pathname === "/" || pathname === "/login" || pathname === "/signup";

  if (hideSidebar) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
      <AccessibilityPanel />
      <NavigationHelp />
    </SidebarProvider>
  );
}
