"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useItems } from "@/contexts/items-context"
import { FileDown } from "lucide-react"

interface LocationReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LocationReportDialog({ open, onOpenChange }: LocationReportDialogProps) {
  const { items } = useItems()

  // Group items by location
  const itemsByLocation = items.reduce(
    (acc, item) => {
      const location = item.lokacija || "Bez lokacije"
      if (!acc[location]) {
        acc[location] = []
      }
      acc[location].push(item)
      return acc
    },
    {} as Record<string, typeof items>,
  )

  // Calculate totals for each location
  const locationGroups = Object.entries(itemsByLocation).map(([location, groupItems]) => {
    const totalStock = groupItems.reduce((sum, item) => sum + item.stock, 0)
    const totalReserved = groupItems.reduce((sum, item) => sum + item.reserved, 0)
    const totalAvailable = groupItems.reduce((sum, item) => sum + item.available, 0)
    const totalInput = groupItems.reduce((sum, item) => sum + item.input, 0)
    const totalValue = groupItems.reduce((sum, item) => sum + item.stock * item.price, 0)
    const itemCount = groupItems.length

    return {
      location,
      itemCount,
      totalStock,
      totalReserved,
      totalAvailable,
      totalInput,
      totalValue,
      items: groupItems,
    }
  })

  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Izveštaj po Lokaciji</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            h1 {
              color: #333;
              margin-bottom: 10px;
            }
            .meta {
              color: #666;
              margin-bottom: 20px;
            }
            .location-section {
              margin-bottom: 30px;
              page-break-inside: avoid;
            }
            h2 {
              color: #555;
              margin-top: 20px;
              margin-bottom: 10px;
            }
            .summary {
              background: #f4f4f4;
              padding: 10px;
              margin-bottom: 10px;
              border-radius: 4px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #f4f4f4;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .text-right {
              text-align: right;
            }
            @media print {
              button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <h1>Izveštaj po Lokaciji</h1>
          <div class="meta">
            <p>Datum: ${new Date().toLocaleDateString("sr-RS")}</p>
            <p>Ukupno lokacija: ${locationGroups.length}</p>
          </div>
          ${locationGroups
            .map(
              (group) => `
            <div class="location-section">
              <h2>${group.location}</h2>
              <div class="summary">
                <strong>Broj artikala:</strong> ${group.itemCount} | 
                <strong>Ukupno stanje:</strong> ${group.totalStock} | 
                <strong>Rezervisano:</strong> ${group.totalReserved} | 
                <strong>Dostupno:</strong> ${group.totalAvailable} | 
                <strong>Ukupna vrednost:</strong> ${group.totalValue.toFixed(2)} RSD
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Šifra</th>
                    <th>Naziv</th>
                    <th>Projekat</th>
                    <th class="text-right">Stanje</th>
                    <th class="text-right">Rezervisano</th>
                    <th class="text-right">Dostupno</th>
                    <th class="text-right">Cena</th>
                    <th class="text-right">Vrednost</th>
                  </tr>
                </thead>
                <tbody>
                  ${group.items
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.code}</td>
                      <td>${item.name}</td>
                      <td>${item.project}</td>
                      <td class="text-right">${item.stock}</td>
                      <td class="text-right">${item.reserved}</td>
                      <td class="text-right">${item.available}</td>
                      <td class="text-right">${item.price.toFixed(2)} RSD</td>
                      <td class="text-right">${(item.stock * item.price).toFixed(2)} RSD</td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          `,
            )
            .join("")}
          <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #333; color: white; border: none; cursor: pointer; border-radius: 4px;">
            Štampaj / Sačuvaj kao PDF
          </button>
        </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Izveštaj po Lokaciji</DialogTitle>
          <DialogDescription>Pregled artikala grupisanih po lokaciji u magacinu</DialogDescription>
        </DialogHeader>

        <div className="flex justify-end mb-4">
          <Button onClick={handleExportPDF} variant="outline">
            <FileDown className="h-4 w-4 mr-2" />
            Izvezi PDF
          </Button>
        </div>

        <div className="space-y-6">
          {locationGroups.map((group) => (
            <div key={group.location} className="border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">{group.location}</h3>
              <div className="grid grid-cols-3 gap-4 mb-4 text-sm bg-slate-50 dark:bg-slate-900 p-3 rounded">
                <div>
                  <span className="font-medium">Broj artikala:</span> {group.itemCount}
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
                <div>
                  <span className="font-medium">Ukupna Vrednost:</span> {group.totalValue.toFixed(2)} RSD
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Šifra</TableHead>
                    <TableHead>Naziv</TableHead>
                    <TableHead>Projekat</TableHead>
                    <TableHead className="text-right">Stanje</TableHead>
                    <TableHead className="text-right">Rezervisano</TableHead>
                    <TableHead className="text-right">Dostupno</TableHead>
                    <TableHead className="text-right">Cena</TableHead>
                    <TableHead className="text-right">Vrednost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.project}</TableCell>
                      <TableCell className="text-right">{item.stock}</TableCell>
                      <TableCell className="text-right">{item.reserved}</TableCell>
                      <TableCell className="text-right">{item.available}</TableCell>
                      <TableCell className="text-right">{item.price.toFixed(2)} RSD</TableCell>
                      <TableCell className="text-right font-medium">
                        {(item.stock * item.price).toFixed(2)} RSD
                      </TableCell>
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
