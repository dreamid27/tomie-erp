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
  generateQuotationCode,
  type CreateQuotationDto,
} from '@/services/quotation.service';
import { getCustomers, type Customer } from '@/services/customer.service';
import { getProducts, type Product } from '@/services/product.service';
import { useLayout } from '@/contexts/layout-context';

// Zod schema for form validation
const quotationDetailSchema = z.object({
  product_id: z.string().min(1, 'Product is required'),
  description: z.string().min(1, 'Description is required'),
  note: z.string().optional(),
  unit_price: z.number().min(0, 'Unit price must be at least 0'),
  qty: z.number().min(1, 'Quantity must be at least 1'),
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

  const { data: latestCode } = useQuery({
    queryKey: ['quotation', 'latest-code'],
    queryFn: generateQuotationCode,
  });

  const form = useForm<QuotationFormData>({
    resolver: zodResolver(quotationFormSchema),
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
    console.log(data, 'data');
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
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 dark:bg-white/10 border-[1] border-white/20 rounded-lg px-4 py-5">
            <div className="space-y-2">
              <p className="text-sm font-medium">Code: {form.watch('code')}</p>
            </div>
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
                          className="w-full justify-between font-normal"
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 dark:bg-white/10 border-[1] border-white/20 rounded-lg px-4 py-5">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="space-y-4 border-[1px] px-4 py-3 rounded-lg"
              >
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
                              <SelectItem key={product.id} value={product.id}>
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
                              field.onChange(values.floatValue || 0);
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
                              field.onChange(values.floatValue || 1);
                            }}
                            placeholder="1"
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
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
              <Plus className="mr-2 h-4 w-4" /> Add more item
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 dark:bg-white/10 border-[1] border-white/20 rounded-lg px-4 py-5">
            <div className="space-y-4">
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
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-sm">Subtotal</span>
                <span>
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(subtotal)}
                </span>
              </div>

              <div className="border-t pt-2 flex justify-between font-bold">
                <span className="text-sm">Total</span>
                <span>
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(total)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 justify-end space-x-4">
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Saving...' : 'Request Quotation'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
