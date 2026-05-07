import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { ScrollArea } from '@/components/ui/scroll-area.tsx'
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field.tsx'
import {
  CheckboxGroup,
  type CheckedResult,
  type checkGroupOptionsType,
} from '@/components/CheckboxGroup.tsx'
import { useGenres } from '@/features/genres/hooks/useGenres.ts'
import type { MovieResponse } from '@/features/movies/types/movie-types.ts'
import {
  useCreateMovie,
  useUpdateMovie,
} from '@/features/movies/hooks/useUpsertMovie.ts'
import { toDateOnlyString, toStringOrEmpty } from '@/lib/string-utils.ts'
import { useSelector } from 'react-redux'
import {
  selectCurrentApiMode,
  selectSelectedGraphQlFields,
} from '@/store/selectors.ts'
import { GRAPHQL } from '@/features/movies/constants'
import {
  buildMovieCreatePayload,
  buildMovieUpdatePayload,
} from '@/features/movies/utils/buildMovieMutationPayload.ts'

type MovieUpsertMode = 'create' | 'edit'

type MovieUpsertDialogProps = {
  mode: MovieUpsertMode
  movie?: MovieResponse
  triggerLabel?: string
  trigger?: ReactNode
  onSaved?: () => void
}

type MovieFormValues = {
  movieName: string
  releaseDate: string
  worldwideGross: string
  productionBudget: string
  domesticGross: string
  movieLink: string
  genres: string[]
}

function mapMovieToFormValues(movie?: MovieResponse): MovieFormValues {
  const defaultRevenue = movie ? '' : '0'

  return {
    movieName: movie?.movieName ?? '',
    releaseDate: toDateOnlyString(movie?.releaseDate),
    worldwideGross: toStringOrEmpty(movie?.worldwideGross) || defaultRevenue,
    productionBudget: toStringOrEmpty(movie?.productionBudget) || defaultRevenue,
    domesticGross: toStringOrEmpty(movie?.domesticGross) || defaultRevenue,
    movieLink: toStringOrEmpty(movie?.movieLink),
    genres: movie?.genres ?? [],
  }
}

function isValidUrl(value: string): boolean {
  if (!value.trim()) return true

  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function isValidPositiveNumericValue(value: string): boolean {
  const trimmed = value.trim()

  if (!trimmed) return false
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return false

  const parsed = Number(trimmed)
  return Number.isFinite(parsed) && parsed >= 0
}

export function MovieUpsertDialog({
  mode,
  movie,
  triggerLabel,
  trigger,
  onSaved,
}: MovieUpsertDialogProps) {
  const [open, setOpen] = useState(false)
  const apiMode = useSelector(selectCurrentApiMode)
  const selectedGraphQlFields = useSelector(selectSelectedGraphQlFields)
  const scrollTopAnchorRef = useRef<HTMLDivElement | null>(null)

  const {
    data: genres,
    isLoading: isGenresLoading,
    error: genresError,
  } = useGenres()

  const createMovieMutation = useCreateMovie(apiMode)
  const updateMovieMutation = useUpdateMovie(apiMode)

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MovieFormValues>({
    defaultValues: mapMovieToFormValues(movie),
  })

  const watchedGenres = useWatch({
    control,
    name: 'genres',
  })

  const selectedGenres = useMemo(() => watchedGenres ?? [], [watchedGenres])

  const genreOptions = useMemo<checkGroupOptionsType[]>(() => {
    const selected = new Set(selectedGenres)

    return (genres ?? []).map((genre) => ({
      id: genre.id,
      label: genre.name,
      value: genre.name,
      isChecked: selected.has(genre.name),
    }))
  }, [genres, selectedGenres])

  useEffect(() => {
    if (!open) return
    reset(mapMovieToFormValues(movie))
  }, [movie, open, reset])

  useEffect(() => {
    if (!open) return

    queueMicrotask(() => {
      scrollTopAnchorRef.current?.scrollIntoView({ block: 'start' })
    })
  }, [open, movie?.id])

  const isBusy =
    isSubmitting ||
    createMovieMutation.isPending ||
    updateMovieMutation.isPending

  const submitError =
    (createMovieMutation.error as Error | null)?.message ||
    (updateMovieMutation.error as Error | null)?.message ||
    null

  const dialogTitle = mode === 'create' ? 'Add movie' : 'Edit movie'
  const dialogDescription =
    mode === 'create'
      ? 'Create a new movie record.'
      : 'Update the selected movie.'

  const submitButtonText =
    mode === 'create'
      ? createMovieMutation.isPending
        ? 'Creating…'
        : 'Create'
      : updateMovieMutation.isPending
        ? 'Saving…'
        : 'Save'
  const isGraphQlEditMode = apiMode === GRAPHQL && mode === 'edit'
  const showReleaseDateField =
    !isGraphQlEditMode || selectedGraphQlFields.includes('releaseDate')
  const showWorldwideGrossField =
    !isGraphQlEditMode || selectedGraphQlFields.includes('worldwideGross')
  const showProductionBudgetField =
    !isGraphQlEditMode || selectedGraphQlFields.includes('productionBudget')
  const showDomesticGrossField =
    !isGraphQlEditMode || selectedGraphQlFields.includes('domesticGross')
  const showGenresField =
    !isGraphQlEditMode || selectedGraphQlFields.includes('genres')

  const handleGenreCheckedChange = (result: CheckedResult) => {
    const nextGenres = result.isChecked
      ? [...new Set([...selectedGenres, result.value])]
      : selectedGenres.filter((genre) => genre !== result.value)

    setValue('genres', nextGenres, {
      shouldDirty: true,
    })

    if (nextGenres.length > 0) {
      clearErrors('genres')
    }
  }

  const handleReset = () => {
    reset(mapMovieToFormValues(movie))
  }

  const handleFormSubmit = async (values: MovieFormValues) => {
    if (showGenresField && (values.genres ?? []).length === 0) {
      setError('genres', {
        type: 'required',
        message: 'Select at least one genre',
      })
      return
    }

    if (mode === 'create') {
      await createMovieMutation.mutateAsync(buildMovieCreatePayload(values))
    } else {
      if (!movie?.id) {
        throw new Error('Missing movie id for update.')
      }

      await updateMovieMutation.mutateAsync({
        id: movie.id,
        input: buildMovieUpdatePayload({
          values,
          isGraphQlEditMode,
          selectedGraphQlFields,
        }),
      })
    }

    onSaved?.()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant={mode === 'create' ? 'default' : 'outline'} size="sm">
            {triggerLabel ?? (mode === 'create' ? 'Add movie' : 'Edit')}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[calc(100dvh-1.5rem)] p-0 sm:max-w-[440px]">
        <div className="flex flex-col">
          <div className="border-b border-border px-4 py-3">
            <DialogHeader className="gap-1">
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogDescription>{dialogDescription}</DialogDescription>
            </DialogHeader>
          </div>

          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="flex flex-col"
          >
            <ScrollArea
              className="h-[min(560px,calc(100dvh-11rem))] w-full"
              scrollbars="vertical"
            >
              <div className="space-y-4 px-4 py-3">
                <div ref={scrollTopAnchorRef} />

                <FieldSet>
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Movie name</FieldLabel>
                      <FieldContent>
                        <Input
                          {...register('movieName', {
                            required: 'Movie name is required',
                            minLength: {
                              value: 2,
                              message: 'Movie name is too short',
                            },
                          })}
                          placeholder="e.g. The Matrix"
                          aria-invalid={!!errors.movieName}
                        />
                        <FieldError errors={[errors.movieName]} />
                      </FieldContent>
                    </Field>

                    {showReleaseDateField ? (
                      <Field>
                        <FieldLabel>Release date</FieldLabel>
                        <FieldContent>
                          <Input
                            type="date"
                            {...register('releaseDate', {
                              required: 'Release date is required',
                            })}
                            aria-invalid={!!errors.releaseDate}
                          />
                          <FieldError errors={[errors.releaseDate]} />
                        </FieldContent>
                      </Field>
                    ) : null}

                    {showWorldwideGrossField ? (
                      <Field>
                        <FieldLabel>Worldwide gross (USD)</FieldLabel>
                        <FieldContent>
                          <Input
                            inputMode="numeric"
                            {...register('worldwideGross', {
                              validate: (value) =>
                                isValidPositiveNumericValue(value) ||
                                'Enter zero or a positive numeric value',
                            })}
                            placeholder="e.g. 463517383"
                            aria-invalid={!!errors.worldwideGross}
                          />
                          <FieldError errors={[errors.worldwideGross]} />
                        </FieldContent>
                      </Field>
                    ) : null}

                    {showProductionBudgetField ? (
                      <Field>
                        <FieldLabel>Production budget (USD)</FieldLabel>
                        <FieldContent>
                          <Input
                            inputMode="numeric"
                            {...register('productionBudget', {
                              validate: (value) =>
                                isValidPositiveNumericValue(value) ||
                                'Enter zero or a positive numeric value',
                            })}
                            placeholder="e.g. 63000000"
                            aria-invalid={!!errors.productionBudget}
                          />
                          <FieldError errors={[errors.productionBudget]} />
                        </FieldContent>
                      </Field>
                    ) : null}

                    {showDomesticGrossField ? (
                      <Field>
                        <FieldLabel>Domestic gross (USD)</FieldLabel>
                        <FieldContent>
                          <Input
                            inputMode="numeric"
                            {...register('domesticGross', {
                              validate: (value) =>
                                isValidPositiveNumericValue(value) ||
                                'Enter zero or a positive numeric value',
                            })}
                            placeholder="e.g. 171479930"
                            aria-invalid={!!errors.domesticGross}
                          />
                          <FieldError errors={[errors.domesticGross]} />
                        </FieldContent>
                      </Field>
                    ) : null}

                    {showGenresField ? (
                      <Field>
                        <FieldLabel>Genres</FieldLabel>
                        <FieldContent>
                          {isGenresLoading ? (
                            <div className="text-sm text-muted-foreground">
                              Loading genres…
                            </div>
                          ) : genresError ? (
                            <div className="text-sm text-destructive">
                              {(genresError as Error).message}
                            </div>
                          ) : (
                            <CheckboxGroup
                              options={genreOptions}
                              onChecked={handleGenreCheckedChange}
                              optionsClassName="grid grid-cols-2 gap-2"
                            />
                          )}
                          <FieldError errors={[errors.genres]} />
                        </FieldContent>
                      </Field>
                    ) : null}

                    {submitError ? (
                      <div className="text-sm text-destructive">
                        {submitError}
                      </div>
                    ) : null}
                  </FieldGroup>
                </FieldSet>
              </div>
            </ScrollArea>

            <div className="flex items-center gap-2 border-t border-border px-4 py-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                disabled={isBusy}
              >
                Reset
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={() => setOpen(false)}
                disabled={isBusy}
              >
                Cancel
              </Button>

              <Button type="submit" size="sm" disabled={isBusy}>
                {submitButtonText}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
