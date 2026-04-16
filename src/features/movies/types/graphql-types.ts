import {
  movieGraphQlFields,
  type GraphQlFieldKey,
} from '@/features/movies/types/movie-types.ts'

export { movieGraphQlFields }

export const graphQlOptions = movieGraphQlFields.map((field) => ({
  id: field,
  value: field,
  label: field,
  isChecked: true,
}))

export const tranformToCheckgroupOptions = (options: GraphQlFieldKey[]) => {
  return options.map((field) => {
    return {
      id: field,
      value: field,
      label: field,
      isChecked: true,
    }
  })
}
