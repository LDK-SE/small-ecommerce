export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-md opacity-70 ${className}`}
      style={{ background: 'var(--color-surface-soft)' }}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="surface-card flex h-full flex-col overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-10 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="surface-card p-6">
        <Skeleton className="mb-4 h-4 w-24" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="grid gap-3 sm:grid-cols-[84px_1fr]">
            <div className="order-2 flex gap-2 sm:order-1 sm:flex-col">
              {[1, 2, 3].map((i) => (<Skeleton key={i} className="h-20 w-20 shrink-0 rounded-md" />))}
            </div>
            <Skeleton className="aspect-[4/3] w-full rounded-lg" />
          </div>
          <div className="space-y-5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-10 w-32 rounded-lg" />
            <div className="flex gap-2">{Array.from({ length: 3 }, (_, i) => (<Skeleton key={i} className="h-11 w-24 rounded-md" />))}</div>
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrderListSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="surface-card p-5">
          <div className="flex flex-col gap-3 border-b border-theme pb-4 sm:flex-row sm:justify-between">
            <div>
              <Skeleton className="h-5 w-48" />
              <Skeleton className="mt-2 h-3 w-36" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-7 w-16 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <Skeleton className="h-14 w-full rounded-md" />
            {[1, 2].map((j) => (
              <div key={j} className="flex justify-between gap-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-theme pt-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
