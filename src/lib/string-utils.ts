export function toStringOrEmpty(value: unknown): string {
  return value == null ? '' : String(value)
}

function padDatePart(value: number): string {
  return String(value).padStart(2, '0')
}

export function toDateOnlyString(value: Date | string | undefined): string {
  if (!value) return ''

  if (typeof value === 'string') {
    const isoDateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/)

    if (isoDateMatch) {
      return `${isoDateMatch[1]}-${isoDateMatch[2]}-${isoDateMatch[3]}`
    }

    const parsed = new Date(value)

    if (Number.isNaN(parsed.getTime())) {
      return ''
    }

    return `${parsed.getFullYear()}-${padDatePart(parsed.getMonth() + 1)}-${padDatePart(parsed.getDate())}`
  }

  if (Number.isNaN(value.getTime())) {
    return ''
  }

  return `${value.getFullYear()}-${padDatePart(value.getMonth() + 1)}-${padDatePart(value.getDate())}`
}

export function formatToMoney(value: number | null): string {
  if(value == null) return '—'

  return new Intl.NumberFormat('en-US',
    { style: 'currency', currency: 'USD' }
  ).format(value)
}

export function formatToDate(value: Date | string | undefined): string {
  const normalizedDate = toDateOnlyString(value)

  if (!normalizedDate) return ''

  const [year, month, day] = normalizedDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}
