export function TranscriptSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`flex flex-col gap-1 ${i % 2 === 0 ? "items-start" : "items-end"}`}
        >
          <div className="h-2 w-14 rounded bg-white/10" />
          <div
            className={`h-10 rounded-2xl bg-white/5 ${i % 2 === 0 ? "w-3/4" : "w-1/2"}`}
          />
        </div>
      ))}
    </div>
  );
}