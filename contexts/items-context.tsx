"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Item, Reservation, Pickup, InputHistory } from "@/lib/types"
import { mockItems, mockReservations, mockPickups, mockInputHistory } from "@/lib/mock-data"

interface ItemsContextType {
  items: Item[]
  reservations: Reservation[]
  pickups: Pickup[]
  inputHistory: InputHistory[]
  addItem: (
    item: Omit<
      Item,
      | "id"
      | "created_at"
      | "updated_at"
      | "output"
      | "stock"
      | "reserved"
      | "available"
      | "rezervisao"
      | "vreme_rezervacije"
      | "sifra_rezervacije"
      | "preuzeo"
      | "vreme_preuzimanja"
      | "sifra_preuzimanja"
    >,
  ) => void
  updateItem: (item: Item) => void
  deleteItem: (itemId: string) => void
  addReservation: (reservation: Omit<Reservation, "id" | "reserved_at">) => void
  addPickup: (pickup: Omit<Pickup, "id" | "picked_up_at" | "confirmed_at">) => void
  recalculateItem: (itemId: string) => void
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined)

export function ItemsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>(mockItems)
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations)
  const [pickups, setPickups] = useState<Pickup[]>(mockPickups)
  const [inputHistory, setInputHistory] = useState<InputHistory[]>(mockInputHistory)

  const recalculateItem = (itemId: string) => {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== itemId) return item

        const totalInput = inputHistory.filter((h) => h.item_id === itemId).reduce((sum, h) => sum + h.quantity, 0)

        // Calculate total reserved for this item
        const totalReserved = reservations.filter((r) => r.item_id === itemId).reduce((sum, r) => sum + r.quantity, 0)

        // Calculate total picked up (output) for this item
        const totalOutput = pickups
          .filter((p) => p.item_id === itemId && p.confirmed_at)
          .reduce((sum, p) => sum + p.quantity, 0)

        // Get latest reservation and pickup info
        const latestReservation = reservations
          .filter((r) => r.item_id === itemId)
          .sort((a, b) => new Date(b.reserved_at).getTime() - new Date(a.reserved_at).getTime())[0]

        const latestPickup = pickups
          .filter((p) => p.item_id === itemId && p.confirmed_at)
          .sort((a, b) => new Date(b.picked_up_at).getTime() - new Date(a.picked_up_at).getTime())[0]

        // Calculate stock and available
        const stock = totalInput - totalOutput
        const available = stock - totalReserved

        return {
          ...item,
          input: totalInput,
          output: totalOutput,
          stock,
          reserved: totalReserved,
          available,
          rezervisao: latestReservation?.reserved_by,
          vreme_rezervacije: latestReservation?.reserved_at,
          sifra_rezervacije: latestReservation?.reservation_code,
          preuzeo: latestPickup?.picked_up_by,
          vreme_preuzimanja: latestPickup?.picked_up_at,
          sifra_preuzimanja: latestPickup?.confirmation_code,
          updated_at: new Date().toISOString(),
        }
      }),
    )
  }

  useEffect(() => {
    const itemIds = new Set([
      ...reservations.map((r) => r.item_id),
      ...pickups.map((p) => p.item_id),
      ...inputHistory.map((h) => h.item_id),
    ])
    itemIds.forEach((itemId) => recalculateItem(itemId))
  }, [reservations.length, pickups.length, inputHistory.length])

  const addItem = (
    newItem: Omit<
      Item,
      | "id"
      | "created_at"
      | "updated_at"
      | "output"
      | "stock"
      | "reserved"
      | "available"
      | "rezervisao"
      | "vreme_rezervacije"
      | "sifra_rezervacije"
      | "preuzeo"
      | "vreme_preuzimanja"
      | "sifra_preuzimanja"
    >,
  ) => {
    const existingItem = items.find((item) => item.code === newItem.code && item.name === newItem.name)

    if (existingItem) {
      // Add to input history instead of creating new item
      const newHistory: InputHistory = {
        id: Math.random().toString(36).substr(2, 9),
        item_id: existingItem.id,
        quantity: newItem.input,
        price: newItem.price,
        supplier: newItem.supplier,
        input_date: new Date().toISOString(),
      }
      setInputHistory((prev) => [...prev, newHistory])

      // Update the item's supplier and price to the latest
      setItems((prev) =>
        prev.map((item) =>
          item.id === existingItem.id
            ? {
                ...item,
                supplier: newItem.supplier,
                price: newItem.price,
                project: newItem.project, // Allow project change
                okov_ime: newItem.okov_ime || item.okov_ime,
                okov_cena: newItem.okov_cena || item.okov_cena,
                okov_kom: (item.okov_kom || 0) + (newItem.okov_kom || 0),
                ploce_ime: newItem.ploce_ime || item.ploce_ime,
                ploce_cena: newItem.ploce_cena || item.ploce_cena,
                ploce_kom: (item.ploce_kom || 0) + (newItem.ploce_kom || 0),
                updated_at: new Date().toISOString(),
              }
            : item,
        ),
      )

      // Trigger recalculation
      setTimeout(() => recalculateItem(existingItem.id), 0)
    } else {
      // Create new item
      const itemId = Math.random().toString(36).substr(2, 9)
      const item: Item = {
        ...newItem,
        id: itemId,
        output: 0,
        stock: newItem.input,
        reserved: 0,
        available: newItem.input,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setItems((prev) => [...prev, item])

      // Add initial input history
      const newHistory: InputHistory = {
        id: Math.random().toString(36).substr(2, 9),
        item_id: itemId,
        quantity: newItem.input,
        price: newItem.price,
        supplier: newItem.supplier,
        input_date: new Date().toISOString(),
      }
      setInputHistory((prev) => [...prev, newHistory])
    }
  }

  const updateItem = (updatedItem: Item) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === updatedItem.id) {
          const inputChanged = item.input !== updatedItem.input
          if (inputChanged) {
            const stock = updatedItem.input - item.output
            const available = stock - item.reserved
            return { ...updatedItem, stock, available, updated_at: new Date().toISOString() }
          }
          return { ...updatedItem, updated_at: new Date().toISOString() }
        }
        return item
      }),
    )
  }

  const deleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId))
    setReservations((prev) => prev.filter((r) => r.item_id !== itemId))
    setPickups((prev) => prev.filter((p) => p.item_id !== itemId))
    setInputHistory((prev) => prev.filter((h) => h.item_id !== itemId))
  }

  const addReservation = (reservation: Omit<Reservation, "id" | "reserved_at">) => {
    const newReservation: Reservation = {
      ...reservation,
      id: Math.random().toString(36).substr(2, 9),
      reserved_at: new Date().toISOString(),
    }
    setReservations((prev) => [...prev, newReservation])
    setTimeout(() => recalculateItem(reservation.item_id), 0)
  }

  const addPickup = (pickup: Omit<Pickup, "id" | "picked_up_at" | "confirmed_at">) => {
    const newPickup: Pickup = {
      ...pickup,
      id: Math.random().toString(36).substr(2, 9),
      picked_up_at: new Date().toISOString(),
      confirmed_at: pickup.confirmation_code?.length === 6 ? new Date().toISOString() : undefined,
    }
    setPickups((prev) => [...prev, newPickup])
    setTimeout(() => recalculateItem(pickup.item_id), 0)
  }

  return (
    <ItemsContext.Provider
      value={{
        items,
        reservations,
        pickups,
        inputHistory,
        addItem,
        updateItem,
        deleteItem,
        addReservation,
        addPickup,
        recalculateItem,
      }}
    >
      {children}
    </ItemsContext.Provider>
  )
}

export function useItems() {
  const context = useContext(ItemsContext)
  if (context === undefined) {
    throw new Error("useItems must be used within an ItemsProvider")
  }
  return context
}
