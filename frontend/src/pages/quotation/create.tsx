import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { createQuotation, generateQuotationCode, type CreateQuotationDto } from '@/services/quotation.service';

export default function CreateQuotationPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const today = format(new Date(), 'yyyy-MM-dd');

  // This would be replaced with actual customers and products data
  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await fetch('/api/customers');
      return response.json();
    },
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      return response.json();
    },
  });

  const { data: latestCode } = useQuery({
    queryKey: ['quotation', 'latest-code'],
    queryFn: generateQuotationCode,
  });

  const { control, handleSubmit, watch, setValue } = useForm<CreateQuotationDto>({
    defaultValues: {
      code: latestCode || 'Q-0001',
      date: today,
      customer_id: '',
      note: '',
      other_amount: 0,
      details: [
        {
          product_id: '',
          description: '',
          note: '',
          unit_price: 0,
          qty: 1,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'details',
  });

  const createMutation = useMutation({
    mutationFn: createQuotation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      toast.success('Quotation created successfully');
      navigate('/quotation');
    },
    onError: (error) => {
      toast.error(`Failed to create quotation: ${error.message}`);
    },
  });

  const onSubmit = (data: CreateQuotationDto) => {
    createMutation.mutate(data);
  };

  // Calculate subtotal
  const subtotal = watch('details')?.reduce(
    (sum, item) => sum + (item.unit_price || 0) * (item.qty || 0),
    0
  );

  const otherAmount = watch('other_amount') || 0;
  const total = subtotal + (Number.isNaN(otherAmount) ? 0 : otherAmount);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Create New Quotation</h1>
        <Button onClick={() => navigate('/quotation')} variant="outline">
          Back to List
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quotation Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Quotation Number</Label>
                <Controller
                  name="code"
                  control={control}
                  render={({ field }) => (
                    <Input id="code" {...field} readOnly />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <Input id="date" type="date" {...field} />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_id">Customer</Label>
                <Controller
                  name="customer_id"
                  control={control}
                  rules={{ required: 'Customer is required' }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer: any) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Items</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    product_id: '',
                    description: '',
                    note: '',
                    unit_price: 0,
                    qty: 1,
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Item {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`details.${index}.product_id`}>Product</Label>
                    <Controller
                      name={`details.${index}.product_id`}
                      control={control}
                      rules={{ required: 'Product is required' }}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => {
                            const selectedProduct = products.find(
                              (p: any) => p.id === value
                            );
                            field.onChange(value);
                            if (selectedProduct) {
                              setValue(
                                `details.${index}.description`,
                                selectedProduct.name
                              );
                              setValue(
                                `details.${index}.unit_price`,
                                selectedProduct.price
                              );
                            }
                          }}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product: any) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`details.${index}.description`}>
                      Description
                    </Label>
                    <Controller
                      name={`details.${index}.description`}
                      control={control}
                      rules={{ required: 'Description is required' }}
                      render={({ field }) => (
                        <Input id={`details.${index}.description`} {...field} />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`details.${index}.unit_price`}>
                      Unit Price
                    </Label>
                    <Controller
                      name={`details.${index}.unit_price`}
                      control={control}
                      rules={{
                        required: 'Unit price is required',
                        min: { value: 0, message: 'Must be positive' },
                      }}
                      render={({ field }) => (
                        <Input
                          id={`details.${index}.unit_price`}
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`details.${index}.qty`}>Quantity</Label>
                    <Controller
                      name={`details.${index}.qty`}
                      control={control}
                      rules={{
                        required: 'Quantity is required',
                        min: { value: 1, message: 'Must be at least 1' },
                      }}
                      render={({ field }) => (
                        <Input
                          id={`details.${index}.qty`}
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
                          }
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`details.${index}.note`}>Note</Label>
                  <Controller
                    name={`details.${index}.note`}
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        id={`details.${index}.note`}
                        placeholder="Additional notes (optional)"
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="note">Notes</Label>
              <Controller
                name="note"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="note"
                    placeholder="Additional notes for the quotation"
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="other_amount">Other Amount</Label>
                    <Controller
                      name="other_amount"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="other_amount"
                          type="number"
                          className="w-32"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      )}
                    />
                  </div>
                  <span>
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(otherAmount)}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(total)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/quotation')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Saving...' : 'Save Quotation'}
          </Button>
        </div>
      </form>
    </div>
  );
}
