import { type ReactNode } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useGenres } from '@/features/genres/hooks/useGenres.ts'

export function AppLayout({ children }: { children: ReactNode }) {
  useGenres()

  return (
    <div className="min-h-dvh overflow-x-clip bg-muted/40 text-foreground">
      <div className="flex min-h-dvh min-w-0 flex-col overflow-x-clip">
        <header className="sticky top-0 z-30 border-b border-border/80 bg-card/95 text-card-foreground backdrop-blur supports-backdrop-filter:bg-card/80">
          <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-2">
              <div className="truncate text-lg font-semibold text-foreground">
                <span className="pr-2 text-xl" role="img" aria-label="Clapper board">
                  🎬
                </span>
                Movie UI Dashboard
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>

          </div>
        </header>

        <main className="mx-auto flex min-h-0 w-full min-w-0 max-w-screen-2xl flex-1 overflow-x-clip px-3 py-3 sm:px-6 sm:py-5 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
