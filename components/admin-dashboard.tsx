"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { ItemsTable } from "@/components/items-table"
import { AddItemDialog } from "@/components/add-item-dialog"
import { ImportDialog } from "@/components/import-dialog"
import { ProjectReportDialog } from "@/components/project-report-dialog"
import { SupplierReportDialog } from "@/components/supplier-report-dialog"
import { NameReportDialog } from "@/components/name-report-dialog"
import { CodeReportDialog } from "@/components/code-report-dialog"
import { LocationReportDialog } from "@/components/location-report-dialog"
import { UserManagementDialog } from "@/components/user-management-dialog"
import { ProjectManagementDialog } from "@/components/project-management-dialog"
import { ProjectCalendar } from "@/components/project-calendar"
import { Button } from "@/components/ui/button"
import {
  Plus,
  FileText,
  TrendingUp,
  Upload,
  Users,
  Hash,
  Type,
  RefreshCw,
  MapPin,
  Calendar,
  FolderKanban,
} from "lucide-react"
import { useItems } from "@/contexts/items-context"
import { useProjects } from "@/contexts/projects-context"
import type { ImportRow } from "@/lib/types"

export function AdminDashboard() {
  const { items, inputHistory, reservations, pickups, addItem, updateItem, deleteItem, refreshAll } = useItems()
  const { projects } = useProjects()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [isSupplierReportOpen, setIsSupplierReportOpen] = useState(false)
  const [isNameReportOpen, setIsNameReportOpen] = useState(false)
  const [isCodeReportOpen, setIsCodeReportOpen] = useState(false)
  const [isLocationReportOpen, setIsLocationReportOpen] = useState(false)
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false)
  const [isProjectManagementOpen, setIsProjectManagementOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const projectNames = Array.from(new Set(items.map((item) => item.project).filter(Boolean)))

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
        lokacija: row.lokacija,
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
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={refreshAll} title="Osveži podatke">
              <RefreshCw className="h-4 w-4 mr-2" />
              Osveži
            </Button>
            <Button variant="outline" onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
              <Calendar className="h-4 w-4 mr-2" />
              Kalendar
            </Button>
            <Button variant="outline" onClick={() => setIsProjectManagementOpen(true)}>
              <FolderKanban className="h-4 w-4 mr-2" />
              Projekti
            </Button>
            <Button variant="outline" onClick={() => setIsUserManagementOpen(true)}>
              <Users className="h-4 w-4 mr-2" />
              Korisnici
            </Button>
            <Button variant="outline" onClick={() => setIsLocationReportOpen(true)}>
              <MapPin className="h-4 w-4 mr-2" />
              Izveštaj po Lokaciji
            </Button>
            <Button variant="outline" onClick={() => setIsNameReportOpen(true)}>
              <Type className="h-4 w-4 mr-2" />
              Izveštaj po Nazivu
            </Button>
            <Button variant="outline" onClick={() => setIsCodeReportOpen(true)}>
              <Hash className="h-4 w-4 mr-2" />
              Izveštaj po Šifri
            </Button>
            <Button variant="outline" onClick={() => setIsSupplierReportOpen(true)}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Izveštaj po Dobavljačima
            </Button>
            <Button variant="outline" asChild>
              <a href="/primer-magacin-import.csv" download="primer-magacin-import.csv">
                <FileText className="h-4 w-4 mr-2" />
                Preuzmi Primer
              </a>
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

        {projectNames.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Brzi pristup projektima:</h3>
            <div className="flex flex-wrap gap-2">
              {projectNames.map((project) => (
                <Button key={project} variant="outline" size="sm" onClick={() => setSelectedProject(project)}>
                  <FileText className="h-4 w-4 mr-2" />
                  {project}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className={isCalendarOpen ? "grid grid-rows-2 gap-4 h-[calc(100vh-300px)]" : ""}>
          <div className={isCalendarOpen ? "overflow-auto" : ""}>
            <ItemsTable
              items={items}
              inputHistory={inputHistory}
              reservations={reservations}
              pickups={pickups}
              onUpdateItem={updateItem}
              onDeleteItem={deleteItem}
              isAdmin={true}
            />
          </div>
          {isCalendarOpen && (
            <div className="overflow-auto">
              <ProjectCalendar projects={projects} onClose={() => setIsCalendarOpen(false)} />
            </div>
          )}
        </div>

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
        <NameReportDialog open={isNameReportOpen} onOpenChange={setIsNameReportOpen} />
        <CodeReportDialog open={isCodeReportOpen} onOpenChange={setIsCodeReportOpen} />
        <LocationReportDialog open={isLocationReportOpen} onOpenChange={setIsLocationReportOpen} />
        <UserManagementDialog open={isUserManagementOpen} onOpenChange={setIsUserManagementOpen} />
        <ProjectManagementDialog open={isProjectManagementOpen} onOpenChange={setIsProjectManagementOpen} />
      </main>
    </div>
  )
}
