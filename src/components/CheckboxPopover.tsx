import { useMemo, useState } from 'react'
import { CheckboxGroup, type CheckedResult, type checkGroupOptionsType } from '@/components/CheckboxGroup.tsx'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Label } from '@/components/ui/label.tsx'
import { ScrollArea } from '@/components/ui/scroll-area.tsx'
import { type LucideIcon } from 'lucide-react'

/*type CreateCheckgroupOptionsConfig<T> = {
  getId: (item: T) => string
  getLabel?: (item: T) => string
  getValue?: (item: T) => string
  isChecked?: (item: T) => boolean
}*/

/*export function createCheckgroupOptions<T>(
  items: T[],
  config: CreateCheckgroupOptionsConfig<T>
): checkGroupOptionsType[] {
  return items.map((item) => {
    const id = config.getId(item)

    return {
      id,
      label: config.getLabel?.(item) ?? id,
      value: config.getValue?.(item) ?? id,
      isChecked: config.isChecked?.(item) ?? false,
    }
  })
}*/

type CheckboxPopoverProps = {
  title: string
  description: string
  options: string[]
  selected: string[]
  onSelectedChange: (items: string[]) => void
  disabled?: boolean
  Icon?: LucideIcon
  restClearAll?: boolean
};

export function CheckboxPopover({
  title,
  description,
  options,
  selected,
  onSelectedChange,
  disabled = false,
  Icon,
  restClearAll = false,
}: CheckboxPopoverProps) {
  const [open, setOpen] = useState(false)

  const opts:checkGroupOptionsType[] = useMemo<checkGroupOptionsType[]>(
    () =>
      (options ?? []).map((item) => ({
        id: item,
        value: item,
        label: item,
        isChecked: selected.includes(item),
      })),
    [options, selected]
  )

  const handleOptionClick = (result: CheckedResult) => {
    const next = result.isChecked
      ? [...new Set([...selected, result.value])]
      : selected.filter((item) => item !== result.value)

    onSelectedChange(next)
  }

  const handleReset = () => {
    const opt = restClearAll ? [] : options
    onSelectedChange(opt)
  }

  const triggerClassName =
    'h-9 rounded-full border-border bg-background px-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground'

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={triggerClassName}
          aria-label={title}
          title={title}
          disabled={disabled}
        >
          {Icon ? <Icon className="h-4 w-4" /> : null}
          <span>{title}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[calc(100vw-2rem)] max-w-80 p-0 shadow-md"
      >
        <div className="flex flex-col">
          <div className="border-b border-border px-3 py-2.5">
            <PopoverHeader className="gap-1">
              <PopoverTitle>{title}</PopoverTitle>
              <PopoverDescription>{description}</PopoverDescription>
            </PopoverHeader>
          </div>
          <ScrollArea className="max-h-100 px-3 py-3">
            <div className="grid gap-2">
              <Label className="text-xs font-medium text-muted-foreground">
                {title}
              </Label>
              <CheckboxGroup
                options={opts}
                onChecked={handleOptionClick}
                optionsClassName="grid grid-cols-1 gap-2 sm:grid-cols-2"
              />
            </div>
          </ScrollArea>
          <div className="flex items-center gap-2 border-t border-border px-3 py-2.5">
            <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
