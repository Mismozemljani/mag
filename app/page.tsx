import { LoginForm } from "@/components/login-form"
import { Package } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-primary text-primary-foreground p-3 rounded-lg">
              <Package className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Magacin Sistem</h1>
          <p className="text-muted-foreground">Sistem za upravljanje magacinom</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
