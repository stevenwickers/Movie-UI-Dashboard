import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SelectOption } from '@/types/select-types.ts'

interface SelectionDropdownProps<TValue extends string> {
  value: TValue;
  options: SelectOption<TValue>[];
  onChange: (value: TValue) => void;
  placeholder?: string;
}

export function SelectionDropdown<TValue extends string>({
  value,
  options,
  onChange,
  placeholder = '',
}: SelectionDropdownProps<TValue>) {
  return (
    <Select value={value} onValueChange={(nextValue) => onChange(nextValue as TValue)}>
      <SelectTrigger variant="no-focus" className="w-full min-w-0">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label || option.value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
