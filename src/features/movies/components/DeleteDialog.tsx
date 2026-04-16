import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useState,
} from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx'
import { Button } from '@/components/ui/button.tsx'
import type { MovieResponse } from '@/features/movies/types/movie-types.ts'
import { useDeleteMovie } from '@/features/movies/hooks/useUpsertMovie.ts'
import { Trash } from 'lucide-react'
import { useSelector } from 'react-redux'
import { selectCurrentApiMode } from '@/store/selectors.ts'
import { GRAPHQL } from '@/features/movies/constants'

type DeleteDialogProps = {
  movie?: MovieResponse;
  triggerLabel?: string;
  trigger?: ReactNode;
  onSaved?: () => void;
};

export function DeleteDialog({
  movie,
  triggerLabel,
  trigger,
  onSaved,
}: DeleteDialogProps) {
  const [open, setOpen] = useState(false)
  const apiMode = useSelector(selectCurrentApiMode)
  const deleteMovieMutation = useDeleteMovie(apiMode)

  const movieName = movie?.movieName ?? 'this movie'
  const isDeleting = deleteMovieMutation.isPending
  const isGraphQlMode = apiMode === GRAPHQL
  const submitError = (deleteMovieMutation.error as Error | null)?.message ?? null
  const resolvedTrigger =
    trigger && isValidElement<{ disabled?: boolean; title?: string }>(trigger)
      ? cloneElement(
          trigger as ReactElement<{ disabled?: boolean; title?: string }>,
          {
          disabled: isGraphQlMode,
          title: isGraphQlMode
            ? 'Delete is currently available only in REST mode.'
            : trigger.props.title,
          }
        )
      : trigger

  const handleDelete = async () => {
    if (!movie?.id) {
      throw new Error('Missing movie id for delete.')
    }

    await deleteMovieMutation.mutateAsync({ id: movie.id })
    onSaved?.()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {resolvedTrigger ?? (
          <Button
            size="sm"
            variant="outline"
            disabled={isGraphQlMode}
            title={
              isGraphQlMode
                ? 'Delete is currently available only in REST mode.'
                : undefined
            }
          >
            {triggerLabel ?? 'Delete'}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="overflow-hidden p-0 sm:max-w-[460px]">
        <div className="border-b border-border bg-gradient-to-r from-destructive/8 via-background to-background px-5 py-4">
          <DialogHeader className="gap-2 text-left">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10 text-destructive">
              <Trash className="h-4 w-4" />
            </div>
            <DialogTitle className="text-lg">Delete movie</DialogTitle>
            <DialogDescription className="max-w-[36ch] text-sm leading-6">
              This will permanently remove the selected movie from your listings.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Selected movie
            </div>
            <div className="mt-2 text-base font-semibold text-foreground">
              {movieName}
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This action can&apos;t be undone. Any details associated with this movie will be removed from the current dataset.
            </p>
          </div>

          {isGraphQlMode ? (
            <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
              Delete is currently available only in REST mode.
            </div>
          ) : null}

          {submitError ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {submitError}
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/20 px-5 py-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting || isGraphQlMode || !movie?.id}
          >
            {isDeleting ? 'Deleting...' : 'Delete movie'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
