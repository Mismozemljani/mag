"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { PickupDialog } from "@/components/pickup-dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"
import { useItems } from "@/contexts/items-context"
import type { Item } from "@/lib/types"

export function PickupDashboard() {
  const { items, pickups, addPickup } = useItems()
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [isPickupDialogOpen, setIsPickupDialogOpen] = useState(false)

  const handlePickup = (itemId: string) => {
    const item = items.find((i) => i.id === itemId)
    if (item) {
      setSelectedItem(item)
      setIsPickupDialogOpen(true)
    }
  }

  const handleAddPickup = (pickup: Parameters<typeof addPickup>[0]) => {
    addPickup(pickup)
    setIsPickupDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="items" className="space-y-6">
          <TabsList>
            <TabsTrigger value="items">Artikli</TabsTrigger>
            <TabsTrigger value="pickups">Moja Preuzimanja</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Dostupni Artikli</h2>
              <p className="text-muted-foreground">Pregledajte artikle i napravite preuzimanje</p>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="rounded-lg border bg-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Šifra</TableHead>
                          <TableHead>Naziv</TableHead>
                          <TableHead className="text-right">Stanje</TableHead>
                          <TableHead className="text-right">Akcije</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono font-medium">{item.code}</TableCell>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-right">{item.stock}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" onClick={() => handlePickup(item.id)}>
                                <Package className="h-4 w-4 mr-1" />
                                Preuzmi
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pickups" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Moja Preuzimanja</h2>
              <p className="text-muted-foreground">Pregled svih vaših preuzimanja</p>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Artikal</TableHead>
                        <TableHead>Šifra</TableHead>
                        <TableHead className="text-right">Količina</TableHead>
                        <TableHead>Preuzeo</TableHead>
                        <TableHead>Datum</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pickups.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground">
                            Nemate preuzimanja
                          </TableCell>
                        </TableRow>
                      ) : (
                        pickups.map((pickup) => {
                          const item = items.find((i) => i.id === pickup.item_id)
                          return (
                            <TableRow key={pickup.id}>
                              <TableCell className="font-medium">{item?.name}</TableCell>
                              <TableCell className="font-mono">{item?.code}</TableCell>
                              <TableCell className="text-right">{pickup.quantity}</TableCell>
                              <TableCell>{pickup.picked_up_by}</TableCell>
                              <TableCell>{new Date(pickup.picked_up_at).toLocaleString("sr-RS")}</TableCell>
                              <TableCell>
                                {pickup.confirmed_at ? (
                                  <Badge className="bg-green-500 text-white">Potvrđeno</Badge>
                                ) : (
                                  <Badge variant="secondary">Na čekanju</Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {selectedItem && (
        <PickupDialog
          item={selectedItem}
          open={isPickupDialogOpen}
          onOpenChange={setIsPickupDialogOpen}
          onAddPickup={handleAddPickup}
        />
      )}
    </div>
  )
}
