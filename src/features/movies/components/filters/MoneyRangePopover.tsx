import { useState } from 'react'
import { type LucideIcon } from 'lucide-react'
import { type NumberRange } from '@/features/movies/types/filters-types.ts'
import { Label } from '@/components/ui/label.tsx'
import { Slider } from '@/components/ui/slider.tsx'
import { formatToMoney } from '@/lib/string-utils.ts'
import { FilterPopover } from '@/features/movies/components/filters/FilterPopover.tsx'

export const MONEY_RANGE_SLIDER_MIN = 0
export const MONEY_RANGE_SLIDER_MAX = 3_000_000_000
export const MONEY_RANGE_SLIDER_STEP = 10_000_000

type MoneyRangePopoverProps = {
  title: string
  description: string
  Icon?: LucideIcon
  minValue?: number
  maxValue?: number
  onRangeChange: (range: NumberRange) => void
  disabled?: boolean
}

export function MoneyRangePopover({
  title,
  description,
  Icon,
  minValue,
  maxValue,
  onRangeChange,
  disabled = false,
}: MoneyRangePopoverProps) {
  const [open, setOpen] = useState(false)
  const range: [number, number] = [
    minValue ?? MONEY_RANGE_SLIDER_MIN,
    maxValue ?? MONEY_RANGE_SLIDER_MAX,
  ]
  const [low, high] = range

  const handleSliderChange = (values: number[]) => {
    if (values.length !== 2) return

    const nextMin = Number.isFinite(values[0]) ? values[0] : MONEY_RANGE_SLIDER_MIN
    const nextMax = Number.isFinite(values[1]) ? values[1] : MONEY_RANGE_SLIDER_MAX
    onRangeChange({ min: nextMin, max: nextMax })
  }

  const handleReset = () => {
    onRangeChange({ min: undefined, max: undefined })
  }

  return (
    <FilterPopover
      open={open}
      onOpenChange={setOpen}
      title={title}
      description={description}
      icon={Icon}
      contentClassName="w-[calc(100vw-2rem)] max-w-80 p-0 shadow-md"
      bodyClassName="grid gap-4 px-3 py-4"
      onReset={handleReset}
      disabled={disabled}
    >
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="tabular-nums">{formatToMoney(low)}</span>
        <span className="tabular-nums">{formatToMoney(high)}</span>
      </div>

      <Slider
        min={MONEY_RANGE_SLIDER_MIN}
        max={MONEY_RANGE_SLIDER_MAX}
        step={MONEY_RANGE_SLIDER_STEP}
        value={range}
        onValueChange={handleSliderChange}
        minStepsBetweenThumbs={1}
        aria-label={`${title} range`}
      />

      <Label className="text-xs font-medium text-muted-foreground">
        Updates automatically while you drag.
      </Label>
    </FilterPopover>
  )
}
