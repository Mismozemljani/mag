"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, Package, User } from "lucide-react"
import { useRouter } from "next/navigation"

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "MAGACIN_ADMIN":
        return "Administrator"
      case "REZERVACIJA":
        return "Rezervacija"
      case "PREUZIMANJE":
        return "Preuzimanje"
      default:
        return role
    }
  }

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Magacin Sistem</h1>
              <p className="text-sm text-muted-foreground">{getRoleLabel(user?.role || "")}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{user?.name}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Odjava
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
