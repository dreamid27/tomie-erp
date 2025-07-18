import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth-context';

interface QuotationCardSkeletonProps {
  showApproveButton?: boolean;
}

export function QuotationCardSkeleton({ 
  showApproveButton = false 
}: QuotationCardSkeletonProps) {
  const { isSalesUser } = useAuth();

  return (
    <Card className="shadow-none bg-[#00000005] border-black/5 border-[1px] dark:bg-white/10 dark:border-white/10 py-0">
      <CardContent className="flex flex-col gap-4 px-4 py-4">
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            {/* Quotation code */}
            <Skeleton className="h-4 w-32" />
            {/* Date */}
            <Skeleton className="h-4 w-24" />
            {/* Customer name (only for sales users) */}
            {isSalesUser && (
              <Skeleton className="h-4 w-40" />
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            {/* Total price */}
            <Skeleton className="h-5 w-20" />
            {/* Status badge */}
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
        
        <Separator />
        
        {/* Details section */}
        <div className="flex flex-col gap-2 bg-black/5 dark:bg-white/15 p-4 rounded-lg">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        {/* Approve button (only for pending quotations and sales users) */}
        {showApproveButton && isSalesUser && (
          <div className="flex items-end justify-end">
            <Skeleton className="h-9 w-20" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Component for rendering multiple skeleton cards
export function QuotationCardSkeletonList({ 
  count = 3, 
  showApproveButton = false 
}: { 
  count?: number; 
  showApproveButton?: boolean; 
}) {
  return (
    <div className="block space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <QuotationCardSkeleton 
          key={index} 
          showApproveButton={showApproveButton} 
        />
      ))}
    </div>
  );
}
