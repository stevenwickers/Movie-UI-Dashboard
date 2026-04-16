import type { SelectOption } from '@/types/select-types.ts'

export const searchModes = ['general', 'starts', 'ends', 'contains'] as const

export type SearchMode = (typeof searchModes)[number];

export const SearchTypes: SelectOption<SearchMode>[] = [
  { value: 'general' },
  { value: 'starts' },
  { value: 'ends' },
  { value: 'contains' },
]
