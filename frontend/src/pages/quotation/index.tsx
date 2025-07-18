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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { BadgeCheckIcon, XCircleIcon, ClockIcon } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function QuotationPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isSalesUser, isCustomerUser } = useAuth();
  const [quotationToApprove, setQuotationToApprove] = useState<string | null>(
    null
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const pageSize = 4;

  // For sales users, filter to show only pending quotations
  // For customer users, show all quotations (they can't approve anyway)
  const statusFilter = isSalesUser ? 'pending' : undefined;

  const {
    data: paginatedData,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<PaginatedResponse<Quotation>>({
    queryKey: ['quotations', pageSize, statusFilter],
    queryFn: ({ pageParam }) =>
      fetchQuotations(pageParam as number, pageSize, statusFilter),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },
  });

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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Quotation List</h1>
          {!isLoading && (
            <p className="text-sm text-muted-foreground">
              Showing {quotations.length} of {totalItems} quotations
            </p>
          )}
        </div>
        <Button onClick={() => navigate('/quotation/create')}>
          <PlusIcon className="mr-2 h-4 w-4" /> Create New
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="rounded-md border hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Code</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Subtotal</TableHead>
              <TableHead>Other Amount</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotations?.map((quotation) => (
              <TableRow key={quotation.id}>
                <TableCell className="font-medium">{quotation.code}</TableCell>
                <TableCell>{formatDate(quotation.date)}</TableCell>
                <TableCell>
                  <div className="font-medium">{quotation.customer_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {quotation.city}
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(quotation.subtotal)}</TableCell>
                <TableCell>{formatCurrency(quotation.other_amount)}</TableCell>
                <TableCell className="font-semibold">
                  {formatCurrency(quotation.total_price)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      quotation.status === 'draft'
                        ? 'outline'
                        : quotation.status === 'sent'
                        ? 'secondary'
                        : quotation.status === 'approved'
                        ? 'default'
                        : 'destructive'
                    }
                  >
                    {quotation.status.charAt(0).toUpperCase() +
                      quotation.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/quotation/${quotation.id}`)}
                    aria-label="View Quotation"
                  >
                    View
                  </Button>
                  {quotation.status === 'pending' && isSalesUser && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApproveClick(quotation.id)}
                      disabled={isApproving}
                      aria-label="Approve Quotation"
                    >
                      {isApproving && quotationToApprove === quotation.id
                        ? 'Approving...'
                        : 'Approve'}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="block md:hidden space-y-4">
        {quotations?.map((quotation) => (
          <Card
            key={quotation.id}
            className="shadow-sm bg-black/5 border-black/5 border-[1px] dark:bg-white/10  dark:border-white/10 py-0"
          >
            <CardContent className="flex flex-col gap-4 px-4 py-4">
              <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                  <p className="text-sm">{quotation.code}</p>
                  <p className="text-sm">{formatDate(quotation.date)}</p>
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
                    onClick={() => handleApproveClick(quotation.id)}
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
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold mb-4">Confirm Approval</h2>
            <p className="mb-6">
              Are you sure you want to approve this quotation? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={cancelApprove}
                disabled={isApproving}
              >
                Cancel
              </Button>

              <Button
                variant="default"
                onClick={confirmApprove}
                disabled={isApproving}
              >
                {isApproving ? 'Approving...' : 'Approve'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
