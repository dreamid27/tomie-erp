import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  approveQuotation,
  fetchQuotations,
  type Quotation,
} from "@/services/quotation.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function QuotationPage() {
  const navigate = useNavigate();

  const {
    data: quotations,
    refetch: refetchQuotations,
    isLoading,
    isError,
    error,
  } = useQuery<Quotation[], Error>({
    queryKey: ["quotations"],
    queryFn: fetchQuotations,
  });

  const { mutate: approve, isPending: isApproving } = useMutation({
    mutationFn: (id: string) => approveQuotation(id),
    onSuccess: () => {
      refetchQuotations();
    },
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quotations</h1>
        <Button onClick={() => navigate("/quotation/create")}>
          Create New Quotation
        </Button>
      </div>

      <div className="rounded-md border">
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
                  <div className="text-sm text-gray-500">{quotation.city}</div>
                </TableCell>
                <TableCell>{formatCurrency(quotation.subtotal)}</TableCell>
                <TableCell>{formatCurrency(quotation.other_amount)}</TableCell>
                <TableCell className="font-semibold">
                  {formatCurrency(quotation.total_price)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      quotation.status === "draft"
                        ? "outline"
                        : quotation.status === "sent"
                        ? "secondary"
                        : quotation.status === "approved"
                        ? "default"
                        : "destructive"
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
                  >
                    View
                  </Button>
                  {quotation.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => approve(quotation.id)}
                      disabled={isApproving}
                    >
                      {isApproving ? "Approving..." : "Approve"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
