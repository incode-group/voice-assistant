export interface BookingSlot {
  id: string
  startTime: Date
  endTime: Date
  available: boolean
}

export interface BookingRequest {
  name: string
  email: string
  slotId: string
  notes?: string
}