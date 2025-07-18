import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowLeft, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  fetchSalesOrderById,
  type SalesOrder,
} from '@/services/sales-order.service';

export default function InvoicePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: salesOrder,
    isLoading,
    isError,
    error,
  } = useQuery<SalesOrder>({
    queryKey: ['sales-order', id],
    queryFn: () => fetchSalesOrderById(id!),
    enabled: !!id,
  });

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="no-print p-4 border-b bg-gray-50">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/sales-order')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sales Orders
            </Button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !salesOrder) {
    return (
      <div className="min-h-screen bg-white">
        <div className="no-print p-4 border-b bg-gray-50">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/sales-order')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sales Orders
            </Button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Error: {error?.message || 'Sales order not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-white dark:text-gray-900">
      {/* Header - Hidden when printing */}
      <div className="no-print p-4 border-b bg-gray-50 border-gray-200 dark:bg-gray-50 dark:border-gray-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/sales-order')}
            className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-700 dark:hover:text-gray-900 dark:hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sales Orders
          </Button>
          <Button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
          >
            <Printer className="h-4 w-4" />
            Print Invoice
          </Button>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="max-w-4xl mx-auto p-8 print:p-6 bg-white dark:bg-white">
        {/* Company Header */}
        <div className="text-center mb-8 print:mb-6">
          <h1 className="text-3xl font-bold text-gray-900 print:text-2xl dark:text-gray-900">
            Tomie ERP
          </h1>
          <p className="text-gray-600 mt-2 dark:text-gray-600">
            Sales Order Invoice
          </p>
        </div>

        {/* Invoice Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 print:mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-900">
              Invoice Details
            </h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-700">
                  Invoice Number:
                </span>{' '}
                <span className="text-gray-900 dark:text-gray-900">
                  {salesOrder.code}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-700">
                  Date:
                </span>{' '}
                <span className="text-gray-900 dark:text-gray-900">
                  {format(new Date(salesOrder.date), 'dd MMMM yyyy')}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-700">
                  Status:
                </span>{' '}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize dark:bg-blue-100 dark:text-blue-800">
                  {salesOrder.status}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-900">
              Bill To
            </h2>
            <div className="space-y-1">
              <div className="font-medium text-gray-900 dark:text-gray-900">
                {salesOrder.customer_name}
              </div>
              <div className="text-gray-600 dark:text-gray-600">
                {salesOrder.street_address}
              </div>
              <div className="text-gray-600 dark:text-gray-600">
                {salesOrder.city}
              </div>
              <div className="text-gray-600 dark:text-gray-600">
                {salesOrder.phone}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 print:my-6 border-gray-200 dark:border-gray-200" />

        {/* Items Table */}
        <div className="mb-8 print:mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-900">
            Items
          </h2>
          <div className="overflow-x-auto print-avoid-break">
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-300">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-medium w-12 text-gray-900 dark:text-gray-900 dark:border-gray-300">
                    #
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-900 dark:border-gray-300">
                    Description
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-medium w-20 text-gray-900 dark:text-gray-900 dark:border-gray-300">
                    Qty
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-right font-medium w-32 text-gray-900 dark:text-gray-900 dark:border-gray-300">
                    Unit Price
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-right font-medium w-32 text-gray-900 dark:text-gray-900 dark:border-gray-300">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {salesOrder.details?.map((detail, index) => (
                  <tr
                    key={detail.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-50 bg-white dark:bg-white"
                  >
                    <td className="border border-gray-300 px-4 py-3 text-center text-gray-900 dark:text-gray-900 dark:border-gray-300">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 dark:border-gray-300">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-900">
                          {detail.description}
                        </div>
                        {detail.note && (
                          <div className="text-sm text-gray-600 mt-1 dark:text-gray-600">
                            {detail.note}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-gray-900 dark:text-gray-900 dark:border-gray-300">
                      {detail.qty}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right text-gray-900 dark:text-gray-900 dark:border-gray-300">
                      {formatCurrency(detail.unit_price)}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-medium text-gray-900 dark:text-gray-900 dark:border-gray-300">
                      {formatCurrency(detail.total_price)}
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td
                      colSpan={5}
                      className="border border-gray-300 px-4 py-8 text-center text-gray-500 dark:text-gray-500 dark:border-gray-300 bg-white dark:bg-white"
                    >
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Notes */}
        {salesOrder.note && (
          <div className="mb-4 print:mb-6 border-[1px] border-black/10">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{salesOrder.note}</p>
            </div>
          </div>
        )}

        {/* Totals */}
        <div className="flex justify-end mb-8 print:mb-6">
          <Card className="shadow-none w-full max-w-md bg-white border-gray-200 dark:bg-white dark:border-gray-200">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-700">
                    Subtotal:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-900">
                    {formatCurrency(salesOrder.subtotal)}
                  </span>
                </div>
                {salesOrder.other_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-700">
                      Other Amount:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-900">
                      {formatCurrency(salesOrder.other_amount)}
                    </span>
                  </div>
                )}
                <Separator className="border-gray-200 dark:border-gray-200" />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900 dark:text-gray-900">
                    Total:
                  </span>
                  <span className="text-gray-900 dark:text-gray-900">
                    {formatCurrency(salesOrder.total_price)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-12 print:mt-8">
          <p>Thank you for your business!</p>
          <p className="mt-2">
            Generated on {format(new Date(), 'dd MMMM yyyy HH:mm')}
          </p>
        </div>
      </div>
    </div>
  );
}
