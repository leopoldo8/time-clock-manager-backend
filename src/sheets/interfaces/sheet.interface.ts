export interface Break {
  start: Date
  end: Date
  duration: string
}

export interface Sheet {
  start: Date
  end: Date
  breaks?: Break[],
  totalHours: string,
  hoursRemaining: string | boolean,
  hoursExtra: string | boolean
}
