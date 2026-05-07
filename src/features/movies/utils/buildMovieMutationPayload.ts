import type {
  GraphQlFieldKey,
  MovieUpdateRequest,
  MovieUpsertRequest,
} from '@/features/movies/types/movie-types.ts'
import { toNumberOrNull } from '@/lib/number-utils.ts'

export type MoviePayloadFormValues = {
  movieName?: string
  releaseDate?: string
  worldwideGross?: string
  productionBudget?: string
  domesticGross?: string
  movieLink?: string
  genres?: string[]
}

function normalizeText(value: string | undefined): string {
  return value?.trim() ?? ''
}

function buildBaseMoviePayload(
  values: MoviePayloadFormValues,
): MovieUpsertRequest {
  return {
    movieName: normalizeText(values.movieName),
    releaseDate: normalizeText(values.releaseDate) || null,
    worldwideGross: toNumberOrNull(values.worldwideGross),
    productionBudget: toNumberOrNull(values.productionBudget),
    domesticGross: toNumberOrNull(values.domesticGross),
    movieLink: normalizeText(values.movieLink) || null,
    genres: values.genres ?? [],
  }
}

export function buildMovieCreatePayload(
  values: MoviePayloadFormValues,
): MovieUpsertRequest {
  return buildBaseMoviePayload(values)
}

export function buildMovieUpdatePayload(input: {
  values: MoviePayloadFormValues
  isGraphQlEditMode: boolean
  selectedGraphQlFields: GraphQlFieldKey[]
}): MovieUpdateRequest {
  const fullPayload = buildBaseMoviePayload(input.values)

  if (!input.isGraphQlEditMode) {
    return fullPayload
  }

  const payload: MovieUpdateRequest = {
    movieName: fullPayload.movieName,
  }

  if (input.selectedGraphQlFields.includes('releaseDate')) {
    payload.releaseDate = fullPayload.releaseDate
  }

  if (input.selectedGraphQlFields.includes('worldwideGross')) {
    payload.worldwideGross = fullPayload.worldwideGross
  }

  if (input.selectedGraphQlFields.includes('productionBudget')) {
    payload.productionBudget = fullPayload.productionBudget
  }

  if (input.selectedGraphQlFields.includes('domesticGross')) {
    payload.domesticGross = fullPayload.domesticGross
  }

  if (input.selectedGraphQlFields.includes('genres')) {
    payload.genres = fullPayload.genres
  }

  return payload
}
