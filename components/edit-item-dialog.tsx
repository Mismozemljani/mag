"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Item } from "@/lib/types"

interface EditItemDialogProps {
  item: Item
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateItem: (item: Item) => void
}

export function EditItemDialog({ item, open, onOpenChange, onUpdateItem }: EditItemDialogProps) {
  const [formData, setFormData] = useState(item)

  useEffect(() => {
    setFormData(item)
  }, [item])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateItem({ ...formData, updated_at: new Date().toISOString() })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Izmeni Artikal</DialogTitle>
          <DialogDescription>Ažurirajte podatke o artiklu</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-code">Šifra *</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-project">Projekat</Label>
              <Input
                id="edit-project"
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-name">Naziv *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-supplier">Dobavljač</Label>
              <Input
                id="edit-supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-price">Cena</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-input">Ulaz</Label>
              <Input
                id="edit-input"
                type="number"
                step="1"
                value={formData.input}
                onChange={(e) => setFormData({ ...formData, input: Number.parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-threshold">Prag Upozorenja</Label>
              <Input
                id="edit-threshold"
                type="number"
                value={formData.low_stock_threshold}
                onChange={(e) =>
                  setFormData({ ...formData, low_stock_threshold: Number.parseInt(e.target.value) || 10 })
                }
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Okov</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-okov_ime">Naziv</Label>
                <Input
                  id="edit-okov_ime"
                  value={formData.okov_ime || ""}
                  onChange={(e) => setFormData({ ...formData, okov_ime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-okov_cena">Cena</Label>
                <Input
                  id="edit-okov_cena"
                  type="number"
                  step="0.01"
                  value={formData.okov_cena || 0}
                  onChange={(e) => setFormData({ ...formData, okov_cena: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-okov_kom">Količina</Label>
                <Input
                  id="edit-okov_kom"
                  type="number"
                  step="1"
                  value={formData.okov_kom || 0}
                  onChange={(e) => setFormData({ ...formData, okov_kom: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Ploče</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-ploce_ime">Naziv</Label>
                <Input
                  id="edit-ploce_ime"
                  value={formData.ploce_ime || ""}
                  onChange={(e) => setFormData({ ...formData, ploce_ime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-ploce_cena">Cena</Label>
                <Input
                  id="edit-ploce_cena"
                  type="number"
                  step="0.01"
                  value={formData.ploce_cena || 0}
                  onChange={(e) => setFormData({ ...formData, ploce_cena: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-ploce_kom">Količina</Label>
                <Input
                  id="edit-ploce_kom"
                  type="number"
                  step="1"
                  value={formData.ploce_kom || 0}
                  onChange={(e) => setFormData({ ...formData, ploce_kom: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Otkaži
            </Button>
            <Button type="submit">Sačuvaj Izmene</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
