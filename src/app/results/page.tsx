import { Suspense } from 'react';
import Header from '@/components/header';
import ResultsClient from '@/components/results-client';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function ResultsFallback() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-12 w-1/2 mx-auto mb-4" />
          <Skeleton className="h-24 w-1/4 mx-auto mb-6" />
          <Skeleton className="h-8 w-3/4 mx-auto" />
        </CardContent>
      </Card>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-5/6 mb-2" />
            <Skeleton className="h-6 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ResultsPage({
  searchParams,
}: {
  searchParams: { data?: string };
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <Suspense fallback={<ResultsFallback />}>
          <ResultsClient data={searchParams.data} />
        </Suspense>
      </main>
      <footer className="flex items-center justify-center py-4 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Vitality Compass. All rights reserved.</p>
      </footer>
    </div>
  );
}
