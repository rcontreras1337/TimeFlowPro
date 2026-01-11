import { Card, CardContent } from '@/components/ui/card'

/**
 * Skeleton loader for the locations grid
 *
 * @description Shows placeholder cards while locations are loading
 *
 * @ticket T-2-02
 */
export function LocationsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="relative overflow-hidden animate-pulse">
          {/* Color bar skeleton */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700" />

          <CardContent className="p-5 pt-4">
            <div className="flex items-start gap-3">
              {/* Icon skeleton */}
              <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 h-9 w-9" />

              <div className="flex-1 space-y-2">
                {/* Title skeleton */}
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                {/* Subtitle skeleton */}
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>

            {/* Badges skeleton */}
            <div className="flex items-center gap-2 mt-4">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
