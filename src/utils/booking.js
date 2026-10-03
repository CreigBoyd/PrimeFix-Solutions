// Consultation booking helpers. Hours mirror the JSON-LD in index.html:
// Mon-Fri 7:00-18:00, Sat 8:00-14:00, closed Sunday.
export const TIME_SLOTS = [
  { label: '9:00 AM – 10:00 AM', start: 9 * 60, end: 10 * 60 },
  { label: '10:30 AM – 11:30 AM', start: 10 * 60 + 30, end: 11 * 60 + 30 },
  { label: '1:00 PM – 2:00 PM', start: 13 * 60, end: 14 * 60 },
  { label: '2:30 PM – 3:30 PM', start: 14 * 60 + 30, end: 15 * 60 + 30 },
  { label: '4:00 PM – 5:00 PM', start: 16 * 60, end: 17 * 60 },
]

const CLOSING_MINUTES = { 1: 18 * 60, 2: 18 * 60, 3: 18 * 60, 4: 18 * 60, 5: 18 * 60, 6: 14 * 60 } // Sunday (0) closed

function pad(n) {
  return String(n).padStart(2, '0')
}

/** Local (not UTC) YYYY-MM-DD for <input type="date">, `offsetDays` from today. */
export function localDateValue(offsetDays = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Returns an error message, or '' when the date + slot is bookable. */
export function validateBooking(dateStr, slotLabel) {
  if (!dateStr || !slotLabel) return 'Please choose a date and a time window.'
  const [y, m, d] = dateStr.split('-').map(Number)
  const day = new Date(y, m - 1, d).getDay()
  if (dateStr < localDateValue(1)) return 'Please pick a date from tomorrow onward.'
  const closing = CLOSING_MINUTES[day]
  if (!closing) return "We're closed on Sundays. Please pick another day."
  const slot = TIME_SLOTS.find((s) => s.label === slotLabel)
  if (!slot || slot.end > closing) {
    return 'That time window is outside our hours on that day (Saturdays we close at 2:00 PM). Please pick an earlier window.'
  }
  return ''
}
