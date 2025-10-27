"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { ItemsTable } from "@/components/items-table"
import { AddItemDialog } from "@/components/add-item-dialog"
import { ImportDialog } from "@/components/import-dialog"
import { ProjectReportDialog } from "@/components/project-report-dialog"
import { SupplierReportDialog } from "@/components/supplier-report-dialog"
import { Button } from "@/components/ui/button"
import { Plus, FileText, TrendingUp, Upload } from "lucide-react"
import { useItems } from "@/contexts/items-context"
import type { ImportRow } from "@/lib/types"

export function AdminDashboard() {
  const { items, inputHistory, addItem, updateItem, deleteItem } = useItems()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [isSupplierReportOpen, setIsSupplierReportOpen] = useState(false)

  const projects = Array.from(new Set(items.map((item) => item.project).filter(Boolean)))

  const handleAddItem = (newItem: Parameters<typeof addItem>[0]) => {
    addItem(newItem)
    setIsAddDialogOpen(false)
  }

  const handleImport = (rows: ImportRow[]) => {
    rows.forEach((row) => {
      addItem({
        code: row.code,
        project: row.project || "Skladište",
        name: row.name,
        supplier: row.supplier,
        price: row.price,
        input: row.input,
        okov_ime: row.okov_ime,
        okov_cena: row.okov_cena,
        okov_kom: row.okov_kom,
        ploce_ime: row.ploce_ime,
        ploce_cena: row.ploce_cena,
        ploce_kom: row.ploce_kom,
        low_stock_threshold: row.low_stock_threshold || 10,
      })
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Upravljanje Artiklima</h2>
            <p className="text-muted-foreground">Pregled i upravljanje svim artiklima u magacinu</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsSupplierReportOpen(true)}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Izveštaj po dobavljačima
            </Button>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Uvezi iz Excel
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Dodaj Artikal
            </Button>
          </div>
        </div>

        {projects.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Brzi pristup projektima:</h3>
            <div className="flex flex-wrap gap-2">
              {projects.map((project) => (
                <Button key={project} variant="outline" size="sm" onClick={() => setSelectedProject(project)}>
                  <FileText className="h-4 w-4 mr-2" />
                  {project}
                </Button>
              ))}
            </div>
          </div>
        )}

        <ItemsTable
          items={items}
          inputHistory={inputHistory}
          onUpdateItem={updateItem}
          onDeleteItem={deleteItem}
          isAdmin={true}
        />
        <AddItemDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAddItem={handleAddItem} />
        <ImportDialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen} onImport={handleImport} />

        {selectedProject && (
          <ProjectReportDialog
            project={selectedProject}
            items={items}
            open={!!selectedProject}
            onOpenChange={(open) => !open && setSelectedProject(null)}
          />
        )}
        <SupplierReportDialog open={isSupplierReportOpen} onOpenChange={setIsSupplierReportOpen} />
      </main>
    </div>
  )
}
