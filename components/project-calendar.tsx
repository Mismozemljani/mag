"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import type { Project } from "@/lib/types"

interface ProjectCalendarProps {
  projects: Project[]
  onClose: () => void
}

export function ProjectCalendar({ projects, onClose }: ProjectCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthNames = [
    "Januar",
    "Februar",
    "Mart",
    "April",
    "Maj",
    "Jun",
    "Jul",
    "Avgust",
    "Septembar",
    "Oktobar",
    "Novembar",
    "Decembar",
  ]

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const getProjectsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return projects.filter((project) => {
      return dateStr >= project.start_date && dateStr <= project.end_date
    })
  }

  const days = []
  for (let i = 0; i < adjustedFirstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 border border-slate-200 dark:border-slate-800" />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const projectsOnDay = getProjectsForDate(day)
    days.push(
      <div
        key={day}
        className="h-24 border border-slate-200 dark:border-slate-800 p-1 overflow-y-auto hover:bg-slate-50 dark:hover:bg-slate-900"
      >
        <div className="font-semibold text-sm mb-1">{day}</div>
        {projectsOnDay.map((project) => (
          <div
            key={project.id}
            className="text-xs px-1 py-0.5 mb-1 rounded truncate"
            style={{
              backgroundColor: project.color + "33", // Use project color with transparency
              color: project.color, // Use project color for text
              borderLeft: `3px solid ${project.color}`, // Add colored border
            }}
            title={`${project.name}\n${project.start_date} - ${project.end_date}`}
          >
            {project.name}
          </div>
        ))}
      </div>,
    )
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Kalendar Projekata</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={previousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-lg font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-0 mb-2">
        {["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-sm py-2 border border-slate-200 dark:border-slate-800"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0">{days}</div>

      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h4 className="font-semibold mb-2 text-sm">Aktivni Projekti:</h4>
        <div className="space-y-2">
          {projects.map((project) => (
            <div key={project.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border border-slate-300" style={{ backgroundColor: project.color }} />
                <span className="font-medium">{project.name}</span>
              </div>
              <span className="text-muted-foreground">
                {new Date(project.start_date).toLocaleDateString("sr-RS")} -{" "}
                {new Date(project.end_date).toLocaleDateString("sr-RS")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
