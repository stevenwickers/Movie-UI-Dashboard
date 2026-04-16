import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <Field orientation="horizontal">
      <Input 
        type="search" 
        placeholder="Search..." 
        value={value} 
        onChange={(e) => onChange(e.target.value ?? '')} 
      />
    </Field>
  )
}
