export function toNumberOrNull(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

export function isValidNonNegativeNumber(value: string): boolean {
  if (!value.trim()) return true

  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0
}