import { Checkbox } from '@/components/ui/checkbox'
import type { CheckedState } from '@radix-ui/react-checkbox'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { cn } from '@/lib/utils'

export type checkGroupOptionsType = {
  id: string;
  label: string;
  value: string; //No space - for htmlFor element
  isChecked: boolean
}

export type CheckedResult = {
  id: string
  value: string
  isChecked: boolean
}

interface Props {
  options: checkGroupOptionsType[]
  onChecked: (item: CheckedResult) => void
  description?: string | null
  optionsClassName?: string
}

export function CheckboxGroup({
  options,
  onChecked,
  description = null,
  optionsClassName,
}: Props) {
  return (
    <FieldSet>

      {description && (
        <FieldDescription>
          {description}
        </FieldDescription>
      )}

      <FieldGroup className={cn('gap-3', optionsClassName)}>
        {options.map((option:checkGroupOptionsType) => (
          <Field key={option.id} orientation="horizontal">
            <Checkbox
              id={option.id}
              name={`finder-${option.value}-checkbox`}
              checked={option.isChecked}
              onCheckedChange={(checked) =>
                onChecked({
                  id: option.id,
                  value: option.value,
                  isChecked: checked === true,
                })
              }
            />
            <FieldLabel
              htmlFor={`finder-${option.value}-checkbox`}
              className="font-normal"
            >
              {option.label}
            </FieldLabel>
          </Field>
        ))}
      </FieldGroup>
    </FieldSet>
  )
}
