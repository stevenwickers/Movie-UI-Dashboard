import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover.tsx'
import { Button } from '@/components/ui/button.tsx'

const DEFAULT_TRIGGER_CLASS_NAME =
  'h-9 rounded-full border-border bg-background px-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground'

type FilterPopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  triggerLabel?: string;
  icon?: LucideIcon;
  contentClassName: string;
  bodyClassName: string;
  children: ReactNode;
  onReset: () => void;
  triggerClassName?: string;
  disabled?: boolean;
  contentAlign?: 'start' | 'center' | 'end';
};

export function FilterPopover({
  open,
  onOpenChange,
  title,
  description,
  triggerLabel,
  icon: Icon,
  contentClassName,
  bodyClassName,
  children,
  onReset,
  triggerClassName = DEFAULT_TRIGGER_CLASS_NAME,
  disabled = false,
  contentAlign = 'end',
}: FilterPopoverProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
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
          <span>{triggerLabel ?? title}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align={contentAlign} className={contentClassName}>
        <div className="flex flex-col">
          <div className="border-b border-border px-3 py-2.5">
            <PopoverHeader className="gap-1">
              <PopoverTitle>{title}</PopoverTitle>
              {description ? (
                <PopoverDescription>{description}</PopoverDescription>
              ) : null}
            </PopoverHeader>
          </div>

          <div className={bodyClassName}>{children}</div>

          <div className="flex items-center gap-2 border-t border-border px-3 py-2.5">
            <Button type="button" variant="ghost" size="sm" onClick={onReset}>
              Reset
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={() => onOpenChange(false)}
            >
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
