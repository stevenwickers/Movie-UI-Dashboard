import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createMovie,
  updateMovie,
  deleteMovie,
} from '@/features/movies/api/movies-api'
import type {
  MovieUpdateRequest,
  MovieUpsertRequest,
} from '@/features/movies/types/movie-types.ts'
import {
  createGraphQlMovie,
  updateGraphQlMovie,
} from '@/features/movies/api/movie-graphql-api.ts'
import { GRAPHQL } from '@/features/movies/constants'

export function useCreateMovie(apiMode: string = 'rest') {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: MovieUpsertRequest) =>
      apiMode === GRAPHQL ? createGraphQlMovie(input) : createMovie(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['movies'] })
    },
  })
}

export function useUpdateMovie(apiMode: string = 'rest') {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: MovieUpdateRequest }) =>
      apiMode === GRAPHQL
        ? updateGraphQlMovie(id, input)
        : updateMovie(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['movies'] })
    },
  })
}

export function useDeleteMovie(apiMode: string = 'rest') {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      if (apiMode === GRAPHQL) {
        throw new Error(
          'Deleting movies is currently available only in REST mode.',
        )
      }

      return deleteMovie(id)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['movies'] })
    },
  })
}
