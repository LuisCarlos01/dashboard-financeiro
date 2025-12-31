export function ChartSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[300px] bg-neutral-200 rounded-lg"></div>
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
        <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
      </div>
    </div>
  );
}

