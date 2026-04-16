import { useState } from 'react'
import { DatePicker } from '@/components/DatePicker.tsx'
import { type MovieDateRange } from '@/features/movies/types/filters-types.ts'
import { type LucideIcon } from 'lucide-react'
import { FilterPopover } from '@/features/movies/components/filters/FilterPopover.tsx'

type DateField = 'from' | 'to'

type DateRangePopoverProps = {
  title: string
  description: string
  Icon?: LucideIcon
  dateFrom?: string
  dateTo?: string
  disabled?: boolean
  onDateRangeChange: (range: MovieDateRange) => void
}

export function DateRangePopover({
  title,
  description,
  Icon,
  dateFrom,
  dateTo,
  onDateRangeChange,
  disabled = false,
}: DateRangePopoverProps) {
  const [open, setOpen] = useState(false)
  const fromValue = dateFrom ?? ''
  const toValue = dateTo ?? ''

  const formatToIsoDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return year + '-' + month + '-' + day
  }

  const handleDateChange = (field: DateField, date: Date | undefined) => {
    const formatted = date ? formatToIsoDate(date) : undefined

    const nextRange =
      field === 'from'
        ? { from: formatted, to: dateTo || undefined }
        : { from: dateFrom || undefined, to: formatted }

    onDateRangeChange(nextRange)
  }

  const handleReset = () => {
    onDateRangeChange({ from: undefined, to: undefined })
  }

  return (
    <FilterPopover
      open={open}
      onOpenChange={setOpen}
      title={title}
      description={description}
      icon={Icon}
      contentAlign="center"
      contentClassName="w-[calc(100vw-2rem)] max-w-[27rem] p-0 shadow-md"
      bodyClassName="grid gap-4 px-3 py-4 sm:grid-cols-2"
      onReset={handleReset}
      disabled={disabled}
    >
      <div>
        <DatePicker
          onChange={(date) => handleDateChange('from', date)}
          title="Start Date"
          myDate={fromValue}
        />
      </div>

      <div>
        <DatePicker
          onChange={(date) => handleDateChange('to', date)}
          title="End Date"
          myDate={toValue}
        />
      </div>
    </FilterPopover>
  )
}
