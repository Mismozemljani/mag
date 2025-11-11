"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

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
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold">Magacin Sistem</h1>
              <p className="text-sm text-muted-foreground">{getRoleLabel(user?.role || "")}</p>
            </div>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/viber_slika_2025-10-27_13-16-13-555-BUrSBsf0txMwRCGr3clVTt8FlVJken.png"
              alt="Lumberline Logo"
              width={180}
              height={60}
              className="object-contain"
              priority
            />
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
