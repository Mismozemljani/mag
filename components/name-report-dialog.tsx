"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useItems } from "@/contexts/items-context"
import { FileDown } from "lucide-react"

interface NameReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NameReportDialog({ open, onOpenChange }: NameReportDialogProps) {
  const { items, inputHistory } = useItems()

  // Group items by name
  const itemsByName = items.reduce(
    (acc, item) => {
      if (!acc[item.name]) {
        acc[item.name] = []
      }
      acc[item.name].push(item)
      return acc
    },
    {} as Record<string, typeof items>,
  )

  // Calculate totals for each name
  const nameGroups = Object.entries(itemsByName).map(([name, groupItems]) => {
    const totalStock = groupItems.reduce((sum, item) => sum + item.stock, 0)
    const totalReserved = groupItems.reduce((sum, item) => sum + item.reserved, 0)
    const totalAvailable = groupItems.reduce((sum, item) => sum + item.available, 0)
    const totalInput = groupItems.reduce((sum, item) => sum + item.input, 0)
    const totalOutput = groupItems.reduce((sum, item) => sum + item.output, 0)
    const projects = [...new Set(groupItems.map((item) => item.project))].join(", ")
    const codes = [...new Set(groupItems.map((item) => item.code))].join(", ")

    return {
      name,
      codes,
      projects,
      totalStock,
      totalReserved,
      totalAvailable,
      totalInput,
      totalOutput,
      items: groupItems,
    }
  })

  const handleExportPDF = () => {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Izveštaj po Nazivu</DialogTitle>
          <DialogDescription>Pregled artikala grupisanih po nazivu</DialogDescription>
        </DialogHeader>

        <div className="flex justify-end mb-4">
          <Button onClick={handleExportPDF} variant="outline">
            <FileDown className="h-4 w-4 mr-2" />
            Izvezi PDF
          </Button>
        </div>

        <div className="space-y-6">
          {nameGroups.map((group) => (
            <div key={group.name} className="border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">{group.name}</h3>
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="font-medium">Šifre:</span> {group.codes}
                </div>
                <div>
                  <span className="font-medium">Projekti:</span> {group.projects}
                </div>
                <div>
                  <span className="font-medium">Ukupno Stanje:</span> {group.totalStock}
                </div>
                <div>
                  <span className="font-medium">Ukupno Rezervisano:</span> {group.totalReserved}
                </div>
                <div>
                  <span className="font-medium">Ukupno Dostupno:</span> {group.totalAvailable}
                </div>
                <div>
                  <span className="font-medium">Ukupan Ulaz:</span> {group.totalInput}
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Šifra</TableHead>
                    <TableHead>Projekat</TableHead>
                    <TableHead>Dobavljač</TableHead>
                    <TableHead>Cena</TableHead>
                    <TableHead>Stanje</TableHead>
                    <TableHead>Rezervisano</TableHead>
                    <TableHead>Dostupno</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.project}</TableCell>
                      <TableCell>{item.supplier}</TableCell>
                      <TableCell>{item.price.toFixed(2)}</TableCell>
                      <TableCell>{item.stock}</TableCell>
                      <TableCell>{item.reserved}</TableCell>
                      <TableCell>{item.available}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
