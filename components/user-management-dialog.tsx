"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"
import { mockUsers } from "@/lib/mock-data"

interface UserManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserManagementDialog({ open, onOpenChange }: UserManagementDialogProps) {
  const [users, setUsers] = useState(mockUsers)
  const [newUserName, setNewUserName] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")

  const handleAddUser = () => {
    if (!newUserName.trim()) return

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUserName,
      email: newUserEmail || `${newUserName.toLowerCase().replace(/\s+/g, ".")}@magacin.rs`,
      role: "REZERVACIJA" as const,
    }

    setUsers([...users, newUser])
    setNewUserName("")
    setNewUserEmail("")

    // Update mock data
    mockUsers.push(newUser)
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId))
    const index = mockUsers.findIndex((u) => u.id === userId)
    if (index > -1) {
      mockUsers.splice(index, 1)
    }
  }

  const reservationUsers = users.filter((u) => u.role === "REZERVACIJA" || u.role === "MAGACIN_ADMIN")
  const pickupUsers = users.filter((u) => u.role === "PREUZIMANJE" || u.role === "MAGACIN_ADMIN")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upravljanje Korisnicima</DialogTitle>
          <DialogDescription>Dodajte ili uklonite korisnike za rezervacije i preuzimanja</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-4">Dodaj Novog Korisnika</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userName">Ime i Prezime *</Label>
                <Input
                  id="userName"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Marko Marković"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userEmail">Email (opciono)</Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="marko@magacin.rs"
                />
              </div>
            </div>
            <Button onClick={handleAddUser} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Dodaj Korisnika
            </Button>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-4">Korisnici za Rezervacije</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ime</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Uloga</TableHead>
                  <TableHead className="w-[100px]">Akcije</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservationUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      {user.role !== "MAGACIN_ADMIN" && (
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-4">Korisnici za Preuzimanja</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ime</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Uloga</TableHead>
                  <TableHead className="w-[100px]">Akcije</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pickupUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      {user.role !== "MAGACIN_ADMIN" && (
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
