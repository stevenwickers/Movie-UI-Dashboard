import { useState } from 'react'
import { SelectionDropdown } from '@/components/SelectionDropdown.tsx'
import type { SelectOption } from '@/types/select-types.ts'
import { FilterPopover } from '@/features/movies/components/filters/FilterPopover.tsx'

const DEFAULT_PAGE_SIZE = 10

const paginationOptions: SelectOption[] = [
  { value: '5' },
  { value: '10' },
  { value: '15' },
  { value: '20' },
]

type PaginationProps = {
  pageSize: string;
  onPageSizeChange: (pageSize: number) => void;
};

export function PaginationPopover({
  pageSize,
  onPageSizeChange,
}: PaginationProps) {
  const [open, setOpen] = useState(false)

  const handleOptionChange = (value: string) => {
    const parsed = Number(value)
    const nextPageSize = Number.isFinite(parsed) ? parsed : DEFAULT_PAGE_SIZE

    onPageSizeChange(nextPageSize)
    setOpen(false)
  }

  const handleReset = () => {
    onPageSizeChange(DEFAULT_PAGE_SIZE)
    setOpen(false)
  }

  return (
    <FilterPopover
      open={open}
      onOpenChange={setOpen}
      title="Pagination Settings"
      triggerLabel="Pagination"
      triggerClassName="w-full sm:w-auto"
      contentClassName="w-[calc(100vw-2rem)] max-w-80 p-0 shadow-md"
      bodyClassName="flex flex-col p-2"
      onReset={handleReset}
    >
      <SelectionDropdown
        placeholder="Items per page"
        value={pageSize}
        options={paginationOptions}
        onChange={handleOptionChange}
      />
    </FilterPopover>
  )
}
