import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  FileText,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  fetchQuotationById,
  approveQuotation,
  type Quotation,
} from '@/services/quotation.service';
import { useAuth } from '@/contexts/auth-context';

export default function QuotationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isSalesUser } = useAuth();
  const [isApproving, setIsApproving] = useState(false);

  const {
    data: quotation,
    isLoading,
    isError,
    error,
  } = useQuery<Quotation>({
    queryKey: ['quotation', id],
    queryFn: () => fetchQuotationById(id!),
    enabled: !!id,
  });

  const { mutate: approve } = useMutation({
    mutationFn: (quotationId: string) => approveQuotation(quotationId),
    onMutate: () => setIsApproving(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotation', id] });
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      toast.success('Quotation approved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve quotation: ${error.message}`);
    },
    onSettled: () => setIsApproving(false),
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleApprove = () => {
    if (id) {
      approve(id);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (isError || !quotation) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/quotation')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quotations
          </Button>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error?.message || 'Quotation not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/quotation')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">{quotation.code}</h1>
            <p className="text-sm text-muted-foreground">Quotation Details</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className={`${getStatusColor(quotation.status)} capitalize`}>
            {quotation.status}
          </Badge>
          {quotation.status === 'pending' && isSalesUser && (
            <Button onClick={handleApprove} disabled={isApproving} size="sm">
              {isApproving ? 'Approving...' : 'Approve'}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 ">
        {/* Customer Information */}
        <Card className="bg-[#00000005] border-black/5 border-[1px] dark:bg-white/10  dark:border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Customer Name
                </p>
                <p className="text-base font-semibold">
                  {quotation.customer_name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Date
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-base">{formatDate(quotation.date)}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Address
                </p>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-base">{quotation.street_address}</p>
                    <p className="text-base">{quotation.city}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Phone
                </p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-base">{quotation.phone}</p>
                </div>
              </div>
            </div>

            {quotation.note && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Notes
                </p>
                <p className="text-base bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                  {quotation.note}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Items */}
        <Card className="bg-[#00000005] border-black/5 border-[1px] dark:bg-white/10  dark:border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5" />
              Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quotation.details.map((detail, index) => (
                <div key={detail.id} className="border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-base">
                        {detail.description}
                      </h4>
                      {detail.note && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {detail.note}
                        </p>
                      )}
                    </div>
                    <div className="text-right sm:text-left sm:min-w-[120px]">
                      <p className="text-sm text-muted-foreground">
                        {detail.qty} × {formatCurrency(detail.unit_price)}
                      </p>
                      <p className="font-semibold text-base">
                        {formatCurrency(detail.total_price)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="bg-[#00000005] border-black/5 border-[1px] dark:bg-white/10  dark:border-white/10">
          <CardHeader>
            <CardTitle className="text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  {formatCurrency(quotation.subtotal)}
                </span>
              </div>

              {quotation.other_amount !== 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Other Amount</span>
                  <span className="font-medium">
                    {formatCurrency(quotation.other_amount)}
                  </span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(quotation.total_price)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
