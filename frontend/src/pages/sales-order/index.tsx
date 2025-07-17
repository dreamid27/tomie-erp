import { useQuery } from "@tanstack/react-query";
import { getSalesOrder } from "@/services/sales-order.service";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function SalesOrderPage() {
  const {
    data: salesOrders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sales-orders"],
    queryFn: getSalesOrder,
  });

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        Error: {error.message}
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      draft: "bg-gray-100 text-gray-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={`${statusMap[status.toLowerCase()] || "bg-gray-100"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sales Orders</h1>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesOrders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.code}</TableCell>
                <TableCell>
                  {format(new Date(order.date), "dd MMM yyyy")}
                </TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(order.total_price)}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!salesOrders?.length && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No sales orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
