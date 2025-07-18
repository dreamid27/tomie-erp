import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  fetchSalesOrders,
  type PaginatedResponse,
  type SalesOrder,
} from '@/services/sales-order.service';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  AlertCircleIcon,
} from 'lucide-react';

export default function SalesOrderPage() {
  const navigate = useNavigate();
  const pageSize = 10;

  const {
    data: paginatedData,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<PaginatedResponse<SalesOrder>>({
    queryKey: ['sales-orders', pageSize],
    queryFn: ({ pageParam }) => fetchSalesOrders(pageParam as number, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },
  });

  // Flatten the data from all pages
  const salesOrders = useMemo(
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

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Sales Orders</h1>
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
        <h1 className="text-2xl font-bold mb-4">Sales Orders</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error.message}
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { className: string; icon: React.ReactNode }
    > = {
      draft: {
        className:
          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        icon: <AlertCircleIcon className="h-3 w-3 mr-1" />,
      },
      confirmed: {
        className:
          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        icon: <CheckCircleIcon className="h-3 w-3 mr-1" />,
      },
      processing: {
        className:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        icon: <ClockIcon className="h-3 w-3 mr-1" />,
      },
      completed: {
        className:
          'bg-green-100 text-green-800 dark:bg-green-600 dark:text-green-200',
        icon: <CheckCircleIcon className="h-3 w-3 mr-1" />,
      },
      cancelled: {
        className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        icon: <XCircleIcon className="h-3 w-3 mr-1" />,
      },
    };

    const config = statusConfig[status.toLowerCase()] || {
      className: 'bg-gray-100 text-gray-800',
      icon: <AlertCircleIcon className="h-3 w-3 mr-1" />,
    };

    return (
      <Badge className={`capitalize ${config.className}`}>
        {config.icon}
        {status}
      </Badge>
    );
  };

  const handleRowClick = (id: string, event: React.MouseEvent) => {
    // Prevent navigation if clicking on buttons or interactive elements
    const target = event.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="button"]')) {
      return;
    }
    navigate(`/sales-order/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Sales Order List</h1>
          {!isLoading && (
            <p className="text-sm text-muted-foreground">
              Showing {salesOrders?.length || 0} of {totalItems} sales orders
            </p>
          )}
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="block space-y-4">
        {salesOrders?.map((order) => (
          <Card
            key={order.id}
            className="shadow-sm bg-black/5 border-black/5 border-[1px] dark:bg-white/10 dark:border-white/10 py-0 cursor-pointer hover:bg-black/10 dark:hover:bg-white/20 hover:border-black/20 dark:hover:border-white/30 transition-all duration-200 hover:shadow-md"
            onClick={(e) => handleRowClick(order.id, e)}
          >
            <CardContent className="flex flex-col gap-4 px-4 py-4">
              <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium">{order.code}</p>
                  <p className="text-sm">
                    {format(new Date(order.date), 'dd MMM yyyy')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.customer_name}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex flex-col gap-2 bg-black/15 dark:bg-white/15 p-4 rounded-lg">
                {order.details?.map((detail, i) => (
                  <div key={detail.id || i} className="text-sm">
                    {i + 1}. {detail.description}, {detail.qty} x{' '}
                    <span className="text-md font-medium">
                      {formatCurrency(detail.unit_price)}
                    </span>
                  </div>
                )) || (
                  <div className="text-sm text-muted-foreground">
                    No details available
                  </div>
                )}
              </div>
              <div className="flex items-end justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/sales-order/${order.id}`);
                  }}
                >
                  View Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {!salesOrders?.length && (
          <div className="text-center py-8">
            <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              No sales orders found
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Get started by creating your first sales order.
            </p>
          </div>
        )}
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
            No more sales orders to load
          </div>
        )}
      </div>
    </div>
  );
}
