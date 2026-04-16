import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface Props {
  title?: string
  myDate: string
  onChange: (value: Date | undefined) => void
}

function parseDate(value: string): Date | undefined {
  if (!value) return undefined

  const directDate = new Date(value)
  if (!Number.isNaN(directDate.getTime())) {
    return directDate
  }

  const [month, day, year] = value.split('/')
  if (!month || !day || !year) return undefined

  const fallbackDate = new Date(`${year}-${month}-${day}`)
  return Number.isNaN(fallbackDate.getTime()) ? undefined : fallbackDate
}

export function DatePicker({ title, myDate, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const date = parseDate(myDate)

  const handleDateChange = (nextDate: Date | undefined) => {
    setOpen(false)
    onChange(nextDate)
  }

  return (
    <Field className="w-full sm:w-44">
      <FieldLabel htmlFor="date">{title}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full justify-start font-normal"
          >
            {date ? date.toLocaleDateString() : 'Select date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            captionLayout="dropdown"
            onSelect={handleDateChange}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
