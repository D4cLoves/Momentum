export function parseDurationToMinutes(duration: string) {
  if (!duration) {
    return 0
  }

  const dayAndTime = duration.split(".")
  const hasDayPart = dayAndTime.length === 2

  const dayValue = hasDayPart ? Number(dayAndTime[0]) : 0
  const timeValue = hasDayPart ? dayAndTime[1] : dayAndTime[0]
  const [hoursRaw, minutesRaw, secondsRaw] = timeValue.split(":")

  const hours = Number(hoursRaw)
  const minutes = Number(minutesRaw)
  const seconds = Number(secondsRaw)

  if (
    Number.isNaN(dayValue) ||
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    Number.isNaN(seconds)
  ) {
    return 0
  }

  const totalMinutes = dayValue * 24 * 60 + hours * 60 + minutes + seconds / 60
  return Math.max(0, Math.round(totalMinutes))
}

export function formatMinutes(totalMinutes: number) {
  const safeMinutes = Math.max(0, Math.round(totalMinutes))
  const hours = Math.floor(safeMinutes / 60)
  const minutes = safeMinutes % 60

  if (hours === 0) {
    return `${minutes}m`
  }

  if (minutes === 0) {
    return `${hours}h`
  }

  return `${hours}h ${minutes}m`
}
