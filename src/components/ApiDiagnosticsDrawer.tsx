import { useSelector } from 'react-redux'
import { selectCurrentApiMode } from '@/store/selectors.ts'
import { Activity, CircleAlert, Clock3, DatabaseZap, Link2 } from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button, Badge, Separator } from '@/components/ui'
import { useApiRequestSnapshot } from '@/lib/api-request-monitor'

type ApiDiagnosticsDrawerProps = {
  isFetching: boolean;
  hasData: boolean;
  isPlaceholderData: boolean;
  dataUpdatedAt: number;
};

function formatTime(value: number | null) {
  if (!value) return 'Not available yet'

  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  }).format(value)
}

function formatDuration(value: number | null) {
  if (value == null) return 'Pending'
  return `${value.toLocaleString()} ms`
}

function getQueryStatusText(input: ApiDiagnosticsDrawerProps) {
  if (input.isFetching && input.hasData) {
    return 'Showing cached TanStack Query data while refreshing from the API.'
  }

  if (input.isFetching) {
    return 'Loading fresh data from the API.'
  }

  if (input.isPlaceholderData) {
    return 'Showing placeholder cached data while the next query settles.'
  }

  if (input.hasData && input.dataUpdatedAt > 0) {
    return 'Showing TanStack Query cached data from the latest successful fetch.'
  }

  return 'No movie query data has been loaded yet.'
}

function getRequestPhaseTone(phase: ReturnType<typeof useApiRequestSnapshot>['phase']) {
  if (phase === 'success') return 'default' as const
  if (phase === 'error') return 'destructive' as const
  if (phase === 'pending') return 'secondary' as const
  return 'outline' as const
}

export function ApiDiagnosticsDrawer(props: ApiDiagnosticsDrawerProps) {
  const request = useApiRequestSnapshot()
  const queryStatusText = getQueryStatusText(props)
  const apiMode = useSelector(selectCurrentApiMode)

  return (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <Activity className="size-4" />
          API status
        </Button>
      </DrawerTrigger>

      <DrawerContent className="mx-auto w-full max-w-screen-lg">
        <DrawerHeader className="text-left">
          <DrawerTitle>API Request Diagnostics</DrawerTitle>
          <DrawerDescription>
            Latest request activity for this app and the current TanStack Query state.
          </DrawerDescription>
        </DrawerHeader>

        <div className="grid gap-4 px-4 pb-6 sm:grid-cols-2">
          <section className="rounded-xl border border-border bg-card p-4 text-card-foreground">
            <div className="mb-3 flex items-center gap-2">
              <Link2 className="size-4 text-muted-foreground" />
              <h3 className="font-medium">Latest API request</h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 pb-3">
              <Badge variant={getRequestPhaseTone(request.phase)}>
                {request.phase === 'idle' ? 'No requests yet' : request.phase}
              </Badge>
              <Badge className={`${apiMode === 'rest' ? 'bg-red-500' : 'bg-green-500'} text-white`} variant="outline">
                {apiMode.toUpperCase()}
              </Badge>
              {request.method ? <Badge variant="outline">{request.method}</Badge> : null}
              {request.statusCode ? (
                <Badge variant="outline">HTTP {request.statusCode}</Badge>
              ) : null}
            </div>

            <dl className="space-y-3 text-sm">
              <div className="space-y-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Request URL
                </dt>
                <dd className="break-all rounded-md bg-muted/60 px-3 py-2 font-mono text-xs">
                  {request.url ?? 'No request captured yet.'}
                </dd>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Completed at
                  </dt>
                  <dd className="flex items-center gap-2">
                    <Clock3 className="size-4 text-muted-foreground" />
                    <span>{formatTime(request.finishedAt ?? request.startedAt)}</span>
                  </dd>
                </div>

                <div className="space-y-1">
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Duration
                  </dt>
                  <dd>{formatDuration(request.durationMs)}</dd>
                </div>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-border bg-card p-4 text-card-foreground">
            <div className="mb-3 flex items-center gap-2">
              <DatabaseZap className="size-4 text-muted-foreground" />
              <h3 className="font-medium">TanStack Query status</h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 pb-3">
              <Badge variant={props.isFetching ? 'secondary' : 'default'}>
                {props.isFetching ? 'Retrieving from API' : 'Serving query state'}
              </Badge>
              {props.hasData ? <Badge variant="outline">Has data</Badge> : null}
              {props.isPlaceholderData ? (
                <Badge variant="outline">Placeholder cache</Badge>
              ) : null}
            </div>

            <p className="text-sm text-muted-foreground">{queryStatusText}</p>

            <Separator className="my-4" />

            <dl className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <CircleAlert className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Last query update
                  </dt>
                  <dd>{formatTime(props.dataUpdatedAt || null)}</dd>
                </div>
              </div>
            </dl>
          </section>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
