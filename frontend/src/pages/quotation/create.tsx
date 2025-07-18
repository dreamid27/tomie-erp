import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, ChevronDown } from 'lucide-react';
import { NumericFormat } from 'react-number-format';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import {
  createQuotation,
  type CreateQuotationDto,
} from '@/services/quotation.service';
import { getCustomers, type Customer } from '@/services/customer.service';
import { getProducts, type Product } from '@/services/product.service';
import { useLayout } from '@/contexts/layout-context';
import { useAuth } from '@/contexts/auth-context';

// Zod schema for form validation
const quotationDetailSchema = z.object({
  product_id: z.string().min(1, 'Product is required'),
  description: z.string().min(1, 'Description is required'),
  note: z.string().optional(),
  unit_price: z.number().min(1, 'Unit price must be greater than 0'),
  qty: z.number().min(1, 'Quantity must be greater than 0'),
});

const quotationFormSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  date: z.string().min(1, 'Date is required'),
  customer_id: z.string().min(1, 'Customer is required'),
  note: z.string().optional(),
  other_amount: z.number().min(0, 'Other amount must be at least 0'),
  details: z
    .array(quotationDetailSchema)
    .min(1, 'At least one item is required'),
});

type QuotationFormData = z.infer<typeof quotationFormSchema>;

export default function CreateQuotationPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setShowBottomNav } = useLayout();
  const { isCustomerUser, userCustomerId } = useAuth();
  const today = format(new Date(), 'yyyy-MM-dd');

  // This would be replaced with actual customers and products data
  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => getCustomers(),
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => getProducts(),
  });

  const form = useForm<QuotationFormData>({
    resolver: zodResolver(quotationFormSchema),
    defaultValues: {
      code: 'Q-0001',
      date: today,
      customer_id: isCustomerUser && userCustomerId ? userCustomerId : '',
      note: '',
      other_amount: 0,
      details: [
        {
          product_id: '',
          description: '',
          note: '',
          unit_price: 0,
          qty: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
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

  const onSubmit = (data: QuotationFormData) => {
    const submitData: CreateQuotationDto = {
      ...data,
      date: new Date(data.date).toISOString(),
      note: data.note || '',
      details: data.details.map((detail) => ({
        ...detail,
        note: detail.note || '',
      })),
    };
    createMutation.mutate(submitData);
  };

  const onError = () => {
    // Small delay to ensure DOM is updated with error states
    setTimeout(() => {
      const firstErrorField = document.querySelector('[aria-invalid="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        // Focus the field if it's an input
        if (
          firstErrorField instanceof HTMLInputElement ||
          firstErrorField instanceof HTMLTextAreaElement
        ) {
          firstErrorField.focus();
        }
      }
    }, 100);
  };

  // Hide bottom navigation on mount, show on unmount
  useEffect(() => {
    setShowBottomNav(false);
    return () => {
      setShowBottomNav(true);
    };
  }, [setShowBottomNav]);

  // Use useEffect to handle form errors
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      onError();
    }
  }, [form.formState.errors]);

  // Set customer_id for customer users when component mounts or when userCustomerId changes
  useEffect(() => {
    if (isCustomerUser && userCustomerId && !form.getValues('customer_id')) {
      form.setValue('customer_id', userCustomerId);
    }
  }, [isCustomerUser, userCustomerId, form]);

  // Calculate subtotal
  const subtotal = form
    .watch('details')
    ?.reduce(
      (sum: number, item) => sum + (item.unit_price || 0) * (item.qty || 0),
      0
    );

  const otherAmount = form.watch('other_amount') || 0;
  const total = subtotal + (Number.isNaN(otherAmount) ? 0 : otherAmount);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-md font-bold">Create Quotation</h1>
        <Button onClick={() => navigate('/quotation')} variant="outline">
          Back to List
        </Button>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="space-y-6"
        >
          {/* Header Section - Quotation Basic Info */}
          <div className="bg-[#00000005] border-black/5 border-[1px] dark:bg-white/10 dark:border-white/10 rounded-lg px-4 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-between font-normal bg-input dark:bg-input/30 border-input"
                          >
                            {field.value
                              ? format(new Date(field.value), 'PPP')
                              : 'Select date'}
                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            field.onChange(date ? date.toISOString() : '');
                          }}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    {isCustomerUser ? (
                      // For customer users: show read-only field with their customer name
                      <FormControl>
                        <Input
                          value={
                            customers.find((c) => c.id === field.value)?.name ||
                            'Loading...'
                          }
                          disabled
                          className="bg-muted"
                        />
                      </FormControl>
                    ) : (
                      // For sales users: show full customer selection
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select customer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers.map((customer: Customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Items Section */}
          <div className="bg-[#00000005] border-black/5 border-[1px] dark:bg-white/10 dark:border-white/10 rounded-lg px-4 py-5">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Quotation Items</h3>
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
                      qty: 0,
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border border-border rounded-lg p-4 space-y-4 bg-card"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-card-foreground">
                        Item {index + 1}
                      </h4>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name={`details.${index}.product_id`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                const selectedProduct = products.find(
                                  (p: Product) => p.id === value
                                );
                                field.onChange(value);
                                if (selectedProduct) {
                                  form.setValue(
                                    `details.${index}.description`,
                                    selectedProduct.name
                                  );
                                }
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select product" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {products.map((product: Product) => (
                                  <SelectItem
                                    key={product.id}
                                    value={product.id}
                                  >
                                    {product.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`details.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="hidden">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input disabled {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`details.${index}.unit_price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit Price</FormLabel>
                            <FormControl>
                              <NumericFormat
                                customInput={Input}
                                thousandSeparator=","
                                decimalSeparator="."
                                prefix="Rp "
                                decimalScale={0}
                                allowNegative={false}
                                value={field.value}
                                onValueChange={(values) => {
                                  field.onChange(values.floatValue);
                                }}
                                placeholder="Rp 0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`details.${index}.qty`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <NumericFormat
                                customInput={Input}
                                thousandSeparator=","
                                decimalScale={0}
                                allowNegative={false}
                                value={field.value}
                                onValueChange={(values) => {
                                  field.onChange(values.floatValue);
                                }}
                                placeholder="0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`details.${index}.note`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Note</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Additional notes (optional)"
                              {...field}
                              className="resize-none"
                              rows={2}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="bg-[#00000005] border-black/5 border-[1px] dark:bg-white/10 dark:border-white/10 rounded-lg px-4 py-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Additional Information
                </h3>
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional notes for the quotation"
                          {...field}
                          className="resize-none"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="other_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Amount</FormLabel>
                      <FormControl>
                        <NumericFormat
                          customInput={Input}
                          thousandSeparator=","
                          decimalSeparator="."
                          prefix="Rp "
                          decimalScale={0}
                          allowNegative={false}
                          value={field.value}
                          onValueChange={(values) => {
                            field.onChange(values.floatValue || 0);
                          }}
                          placeholder="Rp 0"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Summary</h3>
                <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Subtotal
                    </span>
                    <span className="font-medium">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                      }).format(subtotal)}
                    </span>
                  </div>

                  {otherAmount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Other Amount
                      </span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                        }).format(otherAmount)}
                      </span>
                    </div>
                  )}

                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="text-base font-semibold">Total</span>
                    <span className="text-lg font-bold text-primary">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                      }).format(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/quotation')}
              className="sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={createMutation.isPending}
              className="sm:w-auto"
            >
              {createMutation.isPending ? 'Saving...' : 'Request Quotation'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
