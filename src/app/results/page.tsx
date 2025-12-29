
import { Suspense } from 'react';
import Header from '@/components/header';
import ResultsClientWrapper from '@/components/results-client';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function ResultsFallback() {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
       <Card className="text-center shadow-lg bg-card/50">
        <CardContent className="p-6 sm:p-8">
          <Skeleton className="h-8 w-1/3 mx-auto mb-4" />
          <Skeleton className="h-24 w-1/4 mx-auto mb-6" />
          <Skeleton className="h-8 w-1/2 mx-auto" />
        </CardContent>
      </Card>
      <div className="grid gap-6 md:gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6 md:space-y-8">
            <Card className="bg-card/50">
            <CardContent className="p-6">
                <Skeleton className="h-8 w-1/2 mb-4" />
                <Skeleton className="h-64 w-full" />
            </CardContent>
            </Card>
            <Card className="bg-card/50">
            <CardContent className="p-6">
                <Skeleton className="h-8 w-1/2 mb-4" />
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
            </Card>
        </div>
        <div className="space-y-6 md:space-y-8">
            <Card className="bg-card/50">
                <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-8 w-2/3 mb-4" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
            <Card className="bg-card/50">
                <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-8 w-1/2 mb-4" />
                    <Skeleton className="aspect-[4/3] w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <Suspense fallback={<ResultsFallback />}>
          <ResultsClientWrapper />
        </Suspense>
      </main>
    </div>
  );
}
