import { useMemo, useState } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { format } from 'date-fns';
import type { PaginatedResponse } from '@/services/quotation.service';
import { PlusIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  approveQuotation,
  fetchQuotations,
  type Quotation,
} from '@/services/quotation.service';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { BadgeCheckIcon, XCircleIcon, ClockIcon } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

type FilterTab = 'pending' | 'reviewed';

export default function QuotationPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isSalesUser } = useAuth();
  const [quotationToApprove, setQuotationToApprove] = useState<string | null>(
    null
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>('pending');
  const pageSize = 10;

  // Determine status filter based on active tab
  const statusFilter = activeTab === 'pending' ? 'pending' : undefined;
  const excludeStatus = activeTab === 'reviewed' ? 'pending' : undefined;

  const {
    data: paginatedData,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<PaginatedResponse<Quotation>>({
    queryKey: ['quotations', pageSize, activeTab, statusFilter, excludeStatus],
    queryFn: ({ pageParam }) =>
      fetchQuotations(
        pageParam as number,
        pageSize,
        statusFilter,
        excludeStatus
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },
  });

  // Get counts for tab badges (first page only to get total counts)
  const { data: pendingData } = useInfiniteQuery<PaginatedResponse<Quotation>>({
    queryKey: ['quotations-count', 'pending'],
    queryFn: () => fetchQuotations(1, 1, 'pending'),
    initialPageParam: 1,
    getNextPageParam: () => undefined, // Only fetch first page for count
  });

  const { data: reviewedData } = useInfiniteQuery<PaginatedResponse<Quotation>>(
    {
      queryKey: ['quotations-count', 'reviewed'],
      queryFn: () => fetchQuotations(1, 1, undefined, 'pending'),
      initialPageParam: 1,
      getNextPageParam: () => undefined, // Only fetch first page for count
    }
  );

  const pendingCount = pendingData?.pages[0]?.total || 0;
  const reviewedCount = reviewedData?.pages[0]?.total || 0;

  // Flatten the data from all pages
  const quotations = useMemo(
    () => paginatedData?.pages.flatMap((page) => page.data) || [],
    [paginatedData]
  );

  // Calculate total count from the last page
  const totalItems =
    paginatedData?.pages[paginatedData.pages.length - 1]?.total || 0;

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const { mutate: approve, isPending: isApproving } = useMutation({
    mutationFn: (id: string) => approveQuotation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      toast.success('Quotation approved successfully');
      setIsConfirmOpen(false);
      setQuotationToApprove(null);
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve quotation: ${error.message}`);
      setIsConfirmOpen(false);
      setQuotationToApprove(null);
    },
  });

  const handleApproveClick = (id: string) => {
    setQuotationToApprove(id);
    setIsConfirmOpen(true);
  };

  const handleRowClick = (id: string, event: React.MouseEvent) => {
    // Prevent navigation if clicking on buttons or interactive elements
    const target = event.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="button"]')) {
      return;
    }
    navigate(`/quotation/${id}`);
  };

  const confirmApprove = () => {
    if (quotationToApprove) {
      approve(quotationToApprove);
    }
  };

  const cancelApprove = () => {
    setIsConfirmOpen(false);
    setQuotationToApprove(null);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Quotations</h1>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-2"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Quotations</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Quotation List</h1>
          {!isLoading && (
            <p className="text-sm text-muted-foreground">
              Showing {quotations.length} of {totalItems} {activeTab} quotations
            </p>
          )}
        </div>
        <Button onClick={() => navigate('/quotation/create')}>
          <PlusIcon className="mr-2 h-4 w-4" /> Create New
        </Button>
      </div>

      {/* Status Filter Tabs */}
      <div className="mb-6">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as FilterTab)}
        >
          <TabsList className="grid w-full max-w-md grid-cols-2 h-auto">
            <TabsTrigger
              value="pending"
              className="flex items-center gap-1 sm:gap-2 py-2"
            >
              <ClockIcon className="h-4 w-4" />
              <span>Pending</span>
              {pendingCount > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {pendingCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="reviewed"
              className="flex items-center gap-1 sm:gap-2 py-2"
            >
              <BadgeCheckIcon className="h-4 w-4" />
              <span>Reviewed</span>
              {reviewedCount > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {reviewedCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Mobile Cards */}
      <div className="block space-y-4">
        {quotations?.map((quotation) => (
          <Card
            key={quotation.id}
            className="shadow-sm bg-black/5 border-black/5 border-[1px] dark:bg-white/10 dark:border-white/10 py-0 cursor-pointer hover:bg-black/10 dark:hover:bg-white/20 hover:border-black/20 dark:hover:border-white/30 transition-all duration-200 hover:shadow-md"
            onClick={(e) => handleRowClick(quotation.id, e)}
          >
            <CardContent className="flex flex-col gap-4 px-4 py-4">
              <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium">{quotation.code}</p>
                  <p className="text-sm">{formatDate(quotation.date)}</p>
                  {isSalesUser && (
                    <p className="text-sm text-muted-foreground">
                      {quotation.customer_name}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-md font-medium">
                    {formatCurrency(quotation.total_price)}
                  </p>
                  <p>
                    <Badge
                      className={`capitalize ${
                        quotation.status === 'approved'
                          ? 'bg-green-100 text-green-800 dark:bg-green-600 dark:text-green-200'
                          : quotation.status === 'rejected'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {quotation.status === 'approved' && (
                        <BadgeCheckIcon className="h-3 w-3 mr-1" />
                      )}
                      {quotation.status === 'rejected' && (
                        <XCircleIcon className="h-3 w-3 mr-1" />
                      )}
                      {quotation.status === 'pending' && (
                        <ClockIcon className="h-3 w-3 mr-1" />
                      )}
                      {quotation.status}
                    </Badge>
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex flex-col gap-2 bg-black/15 dark:bg-white/15 p-4 rounded-lg">
                {quotation.details.map((detail, i) => (
                  <div key={detail.id} className="text-sm">
                    {i + 1}. {detail.description}, {detail.qty} x{' '}
                    <span className="text-md font-medium">
                      {formatCurrency(detail.unit_price)}
                    </span>
                  </div>
                ))}
              </div>
              {quotation.status === 'pending' && isSalesUser && (
                <div className="flex items-end justify-end">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApproveClick(quotation.id);
                    }}
                    disabled={
                      isApproving && quotationToApprove === quotation.id
                    }
                  >
                    {isApproving && quotationToApprove === quotation.id
                      ? 'Approving...'
                      : 'Approve'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      <div className="mt-6 flex justify-center">
        {isFetchingNextPage ? (
          <div className="py-4">Loading more...</div>
        ) : hasNextPage ? (
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={!hasNextPage || isFetchingNextPage}
            className="mx-auto"
          >
            Load More
          </Button>
        ) : (
          <div className="text-muted-foreground py-4">
            No more quotations to load
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this quotation? This action
              cannot be undone.
              {quotationToApprove && (
                <div className="mt-2 p-2 bg-muted rounded text-sm">
                  <div>
                    <strong>Quotation:</strong>{' '}
                    {quotations.find((q) => q.id === quotationToApprove)?.code}
                  </div>
                  {isSalesUser && (
                    <div className="mt-1">
                      <strong>Customer:</strong>{' '}
                      {
                        quotations.find((q) => q.id === quotationToApprove)
                          ?.customer_name
                      }
                    </div>
                  )}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelApprove} disabled={isApproving}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmApprove} disabled={isApproving}>
              {isApproving ? 'Approving...' : 'Approve'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
