import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx'
import { formatToDate, formatToMoney } from '@/lib/string-utils.ts'
import { Badge } from '@/components/ui/badge.tsx'
import {
  defaultMovieColumnWidths,
  minMovieColumnWidths,
  movieColumnConfig,
  sortableMovieColumns,
  type ColumnKey,
} from '@/features/movies/types/movie-types.ts'
import type {
  MovieResponse,
  SortDirection,
  SortableColumnKey,
} from '@/features/movies/types/movie-types.ts'
import { ArrowUpAZ, ArrowUpDown, ArrowUpZA, Trash, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { MovieUpsertDialog } from '@/features/movies/components/MovieUpsertDialog.tsx'
import { DeleteDialog } from '@/features/movies/components/DeleteDialog.tsx'
type ColumnWidths = Record<ColumnKey, number>;

function isSortableColumnKey(key: ColumnKey): key is SortableColumnKey {
  return sortableMovieColumns.includes(key as SortableColumnKey)
}

type MovieListingsProps = {
  movies: MovieResponse[];
  visibleColumns: ColumnKey[];
  sortColumn: SortableColumnKey;
  sortDirection: SortDirection;
  onColumnSort: (columnKey: SortableColumnKey) => void;
};

function renderDesktopCell(movie: MovieResponse, columnKey: ColumnKey) {
  switch (columnKey) {
    case 'movie':
      return (
        <TableCell
          key={columnKey}
          className="overflow-hidden whitespace-nowrap text-ellipsis font-medium"
        >
          {movie.movieName}
        </TableCell>
      )
    case 'releaseDate':
      return (
        <TableCell
          key={columnKey}
          className="overflow-hidden whitespace-nowrap text-ellipsis text-muted-foreground"
        >
          {formatToDate(movie.releaseDate)}
        </TableCell>
      )
    case 'worldwideGross':
      return (
        <TableCell
          key={columnKey}
          className="overflow-hidden whitespace-nowrap text-ellipsis text-right tabular-nums"
        >
          {formatToMoney(movie.worldwideGross ?? null)}
        </TableCell>
      )
    case 'productionBudget':
      return (
        <TableCell
          key={columnKey}
          className="overflow-hidden whitespace-nowrap text-ellipsis text-right tabular-nums"
        >
          {formatToMoney(movie.productionBudget ?? null)}
        </TableCell>
      )
    case 'domesticGross':
      return (
        <TableCell
          key={columnKey}
          className="overflow-hidden whitespace-nowrap text-ellipsis text-right tabular-nums"
        >
          {formatToMoney(movie.domesticGross ?? null)}
        </TableCell>
      )
    case 'genres':
      return (
        <TableCell key={columnKey} className="overflow-hidden whitespace-nowrap">
          <div className="flex flex-nowrap items-center gap-1 overflow-hidden">
            {movie.genres.slice(0, 3).map((genre) => (
              <Badge
                key={`${movie.id}-${genre}`}
                variant="outline"
                className="rounded-full"
              >
                {genre}
              </Badge>
            ))}

            {movie.genres.length > 3 ? (
              <Badge variant="outline" className="rounded-full">
                +{movie.genres.length - 3}
              </Badge>
            ) : null}
          </div>
        </TableCell>
      )
    case 'edit':
      return (
        <TableCell
          key={columnKey}
          className="overflow-hidden whitespace-nowrap text-right"
        >
          <div className="flex justify-end gap-2">
            <div className="shrink-0">
              <MovieUpsertDialog
                mode="edit"
                movie={movie}
                trigger={(
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${movie.movieName ?? 'movie'}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              />
            </div>
            <div className="shrink-0">
              <DeleteDialog
                movie={movie}
                trigger={(
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${movie.movieName}`}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              />
            </div>
          </div>
        </TableCell>
      )
  }
}

export function MovieListings({
  movies,
  visibleColumns,
  sortColumn,
  sortDirection,
  onColumnSort,
}: MovieListingsProps) {
  const [columnWidths, setColumnWidths] = useState<ColumnWidths>(defaultMovieColumnWidths)

  const handleResizeStart = (columnKey: ColumnKey, startX: number) => {
    const startWidth = columnWidths[columnKey]

    const handleMouseMove = (event: MouseEvent) => {
      const nextWidth = Math.max(
        minMovieColumnWidths[columnKey],
        startWidth + (event.clientX - startX)
      )

      setColumnWidths((prev) => ({
        ...prev,
        [columnKey]: nextWidth,
      }))
    }

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      document.body.classList.remove('is-column-resizing')
    }

    document.body.classList.add('is-column-resizing')

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div
      id="movie-listings-grid"
      className="mx-auto flex min-h-0 w-full flex-col rounded-xl border border-border bg-card text-card-foreground"
    >
      {movies.length === 0 ? (
        <div className="flex min-h-[240px] items-center justify-center p-6 text-center text-muted-foreground">
          No movies found.
        </div>
      ) : (
        <>
          <div className="grid gap-3 p-3 md:hidden">
            {movies.map((movie) => (
              <article
                key={movie.id}
                className="min-w-0 overflow-hidden rounded-xl border border-border bg-background p-4 shadow-sm"
              >
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <h2 className="truncate text-base font-semibold">
                      {movie.movieName}
                    </h2>
                    {visibleColumns.includes('releaseDate') ? (
                      <p className="text-sm text-muted-foreground">
                        Released {formatToDate(movie.releaseDate)}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <MovieUpsertDialog mode="edit" movie={movie} />
                    <DeleteDialog
                      movie={movie}
                      trigger={(
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete ${movie.movieName}`}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    />
                  </div>
                </div>

                <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  {visibleColumns.includes('worldwideGross') &&
                  movie.worldwideGross != null ? (
                    <div className="space-y-1">
                      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Worldwide Gross
                      </dt>
                      <dd className="font-medium tabular-nums">
                        {formatToMoney(movie.worldwideGross ?? null)}
                      </dd>
                    </div>
                  ) : null}
                  {visibleColumns.includes('productionBudget') ? (
                    <div className="space-y-1">
                      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Production Budget
                      </dt>
                      <dd className="font-medium tabular-nums">
                        {formatToMoney(movie.productionBudget ?? null)}
                      </dd>
                    </div>
                  ) : null}
                  {visibleColumns.includes('domesticGross') ? (
                    <div className="space-y-1">
                      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Domestic Gross
                      </dt>
                      <dd className="font-medium tabular-nums">
                        {formatToMoney(movie.domesticGross ?? null)}
                      </dd>
                    </div>
                  ) : null}
                  {visibleColumns.includes('genres') ? (
                    <div className="space-y-1">
                      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Genres
                      </dt>
                      <dd className="flex min-w-0 flex-wrap gap-1.5">
                        {movie.genres.length > 0 ? (
                          movie.genres.map((genre) => (
                            <Badge
                              key={`${movie.id}-${genre}`}
                              variant="outline"
                              className="h-auto max-w-full whitespace-normal break-words rounded-full py-1 text-center"
                            >
                              {genre}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">No genres</span>
                        )}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </article>
            ))}
          </div>

          <div className="hidden min-h-0 overflow-auto rounded-xl border border-border md:flex">
            <Table
              containerClassName="overflow-visible"
              className="min-w-full table-fixed"
            >
              <colgroup>
                {visibleColumns.map((columnKey) => (
                  <col key={columnKey} style={{ width: columnWidths[columnKey] }} />
                ))}
              </colgroup>

              <TableHeader className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
                <TableRow>
                  {visibleColumns.map((columnKey) => {
                    const column = movieColumnConfig[columnKey]

                    return (
                    <TableHead
                      key={columnKey}
                      className={`relative overflow-hidden whitespace-nowrap text-ellipsis bg-muted/80 text-muted-foreground ${
                        column.align === 'right' ? 'text-right' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between pr-3">
                        <span className="block overflow-hidden whitespace-nowrap text-ellipsis">
                          {column.label}
                        </span>

                        {column.sortable && isSortableColumnKey(columnKey) ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (isSortableColumnKey(columnKey)) {
                                onColumnSort(columnKey)
                              }
                            }}
                            className="inline-flex items-center justify-center rounded-sm p-1 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            aria-label={`Sort by ${column.label}`}
                          >
                            {columnKey === sortColumn ? (
                              sortDirection === 'asc' ? (
                                <ArrowUpAZ className="h-4 w-4" />
                              ) : (
                                <ArrowUpZA className="h-4 w-4" />
                              )
                            ) : (
                              <ArrowUpDown className="h-4 w-4" />
                            )}
                          </button>
                        ) : null}
                      </div>

                      {column.resizable ? (
                        <div
                          className="absolute top-0 right-0 h-full w-2 cursor-col-resize select-none"
                          onMouseDown={(event) =>
                            handleResizeStart(columnKey, event.clientX)
                          }
                        >
                          <div className="mx-auto h-full w-px bg-border hover:bg-muted-foreground/40" />
                        </div>
                      ) : null}
                    </TableHead>
                    )
                  })}
                </TableRow>
              </TableHeader>

              <TableBody>
                {movies.map((movie) => (
                  <TableRow key={movie.id} className="whitespace-nowrap">
                    {visibleColumns.map((columnKey) =>
                      renderDesktopCell(movie, columnKey)
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}
