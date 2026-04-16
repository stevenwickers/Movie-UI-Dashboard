import { useQuery } from '@tanstack/react-query'
import { getGenres } from '@/features/genres/api/genres-api'

export function useGenres() {
  return useQuery({
    queryKey: ['genres'],
    queryFn: getGenres,
    staleTime: Infinity,
    gcTime: Infinity,
  })
}