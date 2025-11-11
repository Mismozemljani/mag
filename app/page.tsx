import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/viber_slika_2025-10-27_13-16-13-555-BUrSBsf0txMwRCGr3clVTt8FlVJken.png"
              alt="Lumberline Logo"
              width={200}
              height={80}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Magacin Sistem</h1>
          <p className="text-muted-foreground">Sistem za upravljanje magacinom</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
