"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { ImportRow } from "@/lib/types"

interface ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (rows: ImportRow[]) => void
}

export function ImportDialog({ open, onOpenChange, onImport }: ImportDialogProps) {
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<ImportRow[]>([])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const rows = parseCSV(text)
        setPreview(rows)
      } catch (err) {
        setError("Greška pri čitanju fajla. Proverite format.")
      }
    }

    reader.readAsText(file)
  }

  const parseCSV = (text: string): ImportRow[] => {
    const lines = text.split("\n").filter((line) => line.trim())
    if (lines.length < 2) throw new Error("Fajl mora imati zaglavlje i bar jedan red podataka")

    const headers = lines[0].split(/[,;\t]/).map((h) => h.trim().toLowerCase())
    const rows: ImportRow[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(/[,;\t]/).map((v) => v.trim())
      const row: any = {}

      headers.forEach((header, index) => {
        const value = values[index] || ""

        // Map column names (flexible matching)
        if (header.includes("šifra") || header.includes("sifra") || header === "code") {
          row.code = value
        } else if (header.includes("projekat") || header === "project") {
          row.project = value || "Skladište"
        } else if (header.includes("naziv") || header === "name") {
          row.name = value
        } else if (header.includes("dobavljač") || header.includes("dobavljac") || header === "supplier") {
          row.supplier = value
        } else if (header.includes("cena") || header === "price") {
          row.price = Number.parseFloat(value) || 0
        } else if (header.includes("ulaz") || header === "input") {
          row.input = Number.parseInt(value) || 0
        } else if (header.includes("okov") && header.includes("ime")) {
          row.okov_ime = value
        } else if (header.includes("okov") && header.includes("cena")) {
          row.okov_cena = Number.parseFloat(value) || 0
        } else if (header.includes("okov") && header.includes("kom")) {
          row.okov_kom = Number.parseInt(value) || 0
        } else if (header.includes("ploče") || header.includes("ploce")) {
          if (header.includes("ime")) row.ploce_ime = value
          else if (header.includes("cena")) row.ploce_cena = Number.parseFloat(value) || 0
          else if (header.includes("kom")) row.ploce_kom = Number.parseInt(value) || 0
        } else if (header.includes("prag")) {
          row.low_stock_threshold = Number.parseInt(value) || 10
        }
      })

      if (row.code && row.name) {
        rows.push(row as ImportRow)
      }
    }

    return rows
  }

  const handleImport = () => {
    if (preview.length === 0) {
      setError("Nema podataka za uvoz")
      return
    }
    onImport(preview)
    setPreview([])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Uvoz iz Excel/CSV</DialogTitle>
          <DialogDescription>
            Učitajte CSV ili Excel fajl (sačuvan kao CSV) sa kolonama: šifra, projekat, naziv, dobavljač, cena, ulaz
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <Label htmlFor="file-upload" className="cursor-pointer">
              <div className="text-sm text-muted-foreground mb-2">Kliknite da izaberete fajl ili prevucite ovde</div>
              <Button type="button" variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Izaberi Fajl
              </Button>
            </Label>
            <input id="file-upload" type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {preview.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Pregled ({preview.length} redova)</h4>
              <div className="rounded-lg border max-h-64 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="p-2 text-left">Šifra</th>
                      <th className="p-2 text-left">Naziv</th>
                      <th className="p-2 text-left">Dobavljač</th>
                      <th className="p-2 text-right">Cena</th>
                      <th className="p-2 text-right">Ulaz</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.slice(0, 10).map((row, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-2 font-mono">{row.code}</td>
                        <td className="p-2">{row.name}</td>
                        <td className="p-2">{row.supplier}</td>
                        <td className="p-2 text-right">{row.price.toFixed(2)}</td>
                        <td className="p-2 text-right">{row.input}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {preview.length > 10 && (
                <p className="text-sm text-muted-foreground mt-2">... i još {preview.length - 10} redova</p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Otkaži
            </Button>
            <Button type="button" onClick={handleImport} disabled={preview.length === 0}>
              Uvezi {preview.length > 0 && `(${preview.length})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
