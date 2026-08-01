export default function ActivityListSkeleton() {
   return (
      <div className="space-y-4">
         {Array.from({ length: 6 }).map((_, index) => (
            <div
               key={index}
               className="flex gap-3 rounded-xl border border-border bg-surface p-4 animate-pulse"
            >
               <div className="h-10 w-10 shrink-0 rounded-full bg-surface-high" />

               <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-surface-high" />
                  <div className="h-3 w-24 rounded bg-surface-high" />
               </div>
            </div>
         ))}
      </div>
   );
}