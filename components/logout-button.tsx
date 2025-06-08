"use client"

import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  return (
    <Button onClick={handleLogout} variant="ghost" size="icon" className="h-8 w-8" >
      <LogOut className="w-4 h-4" />
    </Button>
  )
}
