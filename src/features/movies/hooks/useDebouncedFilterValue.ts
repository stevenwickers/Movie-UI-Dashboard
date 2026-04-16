import { useDebouncedValue } from '@tanstack/react-pacer'

export function useDebouncedFilterValue<T>(value:T, wait:number = 500){

  const [debouncedValue, debouncer] = useDebouncedValue(
    value,
    { wait },
    (state) => ({
      isPending: state.isPending,
      status: state.status,
      executionCount: state.executionCount,
    }),
  )

  return {
    debouncedValue,
    debouncer,
    isPending: debouncer.state.isPending,
    status: debouncer.state.status,
    executionCount: debouncer.state.executionCount,
  }

}