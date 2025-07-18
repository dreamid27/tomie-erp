import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { PrismaService } from 'src/prisma.service';
import { QUOTATION_STATUS } from './status.enum';

@Injectable()
export class QuotationService {
  constructor(private prisma: PrismaService) {}

  generateQuotationCode(
    type: 'quotation' | 'sales_order',
    customerUUID: string,
  ) {
    // Ambil 4 karakter terakhir dari UUID pelanggan (tanpa tanda strip)
    const cleanUUID = customerUUID.replace(/-/g, '');
    const clientCode = cleanUUID.slice(-4).toUpperCase();

    // Tanggal hari ini
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    // Unique number dari timestamp (last 6 digits)
    const uniqueNum = Date.now().toString().slice(-6);

    const prefix = type === 'quotation' ? 'QTN' : 'SO';

    // Format akhir
    const quotationCode = `${prefix}/${year}/${month}/${day}/${clientCode}-${uniqueNum}`;
    return quotationCode;
  }

  async create(createQuotationDto: CreateQuotationDto) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id: createQuotationDto.customer_id,
      },
    });

    if (!customer) {
      throw new BadRequestException(
        `customer with id ${createQuotationDto.customer_id} not found`,
      );
    }

    let quotationCode = this.generateQuotationCode('quotation', customer.id);
    let isCodeExist = !!(await this.prisma.quotation.findFirst({
      where: {
        code: quotationCode,
      },
    }));

    while (isCodeExist) {
      quotationCode = this.generateQuotationCode('quotation', customer.id);
      isCodeExist = !!(await this.prisma.quotation.findFirst({
        where: {
          code: quotationCode,
        },
      }));
    }

    const details = createQuotationDto.details.map((detail) => ({
      product_id: detail.product_id,
      description: detail.description,
      note: detail.note,
      unit_price: detail.unit_price,
      qty: detail.qty,
      total_price: detail.unit_price * detail.qty,
    }));

    const totalPriceDetail = details.reduce(
      (total, detail) => total + detail.total_price,
      0,
    );

    return this.prisma.quotation.create({
      data: {
        code: this.generateQuotationCode('quotation', customer.id),
        date: createQuotationDto.date,
        customer_name: customer.name,
        customer_id: customer.id,
        street_address: customer.street_address || '',
        city: customer.city || '',
        phone: customer.phone || '',
        details: {
          create: details,
        },
        note: createQuotationDto.note,
        subtotal: totalPriceDetail,
        other_amount: createQuotationDto.other_amount,
        total_price: totalPriceDetail + createQuotationDto.other_amount,
        status: QUOTATION_STATUS.PENDING,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        details: true,
      },
    });
  }

  async findAll({
    page = 1,
    pageSize = 10,
  }: {
    page: number;
    pageSize: number;
  }) {
    try {
      const skip = (page - 1) * pageSize;
      const [total, data] = await Promise.all([
        this.prisma.quotation.count(),
        this.prisma.quotation.findMany({
          include: {
            details: true,
          },
          skip,
          take: pageSize,
          orderBy: {
            created_at: 'desc', // Most recent first
          },
        }),
      ]);

      const totalPages = Math.ceil(total / pageSize);

      return {
        data,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
      };
    } catch (error) {
      console.error(
        `Error fetching paginated quotations: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to fetch quotations');
    }
  }

  findOne(id: string) {
    return this.prisma.quotation.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateQuotationDto: UpdateQuotationDto) {
    const quotation = await this.prisma.quotation.findUnique({
      where: {
        id: id,
      },
      include: {
        details: true,
      },
    });

    if (!quotation)
      throw new BadRequestException(`quotation with id ${id} not found`);

    if (quotation.status !== QUOTATION_STATUS.PENDING)
      throw new BadRequestException(`quotation with id ${id} is not pending`);

    await this.prisma.$transaction(async (tx) => {
      await tx.quotation.update({
        where: {
          id,
        },
        data: {
          status: updateQuotationDto.status,
          updated_at: new Date(),
        },
      });

      const details = quotation.details.map((detail) => ({
        product_id: detail.product_id,
        description: detail.description,
        note: detail.note,
        unit_price: detail.unit_price,
        qty: detail.qty,
        total_price: detail.unit_price * detail.qty,
      }));

      const totalPriceDetail = details.reduce(
        (total, detail) => total + detail.total_price,
        0,
      );

      await tx.sales_order.create({
        data: {
          code: this.generateQuotationCode(
            'sales_order',
            quotation.customer_id,
          ),
          quotation_id: quotation.id,
          date: quotation.date,
          customer_name: quotation.customer_name,
          customer_id: quotation.customer_id,
          street_address: quotation.street_address || '',
          city: quotation.city || '',
          phone: quotation.phone || '',
          details: {
            create: details,
          },
          note: quotation.note,
          subtotal: totalPriceDetail,
          other_amount: quotation.other_amount,
          total_price: totalPriceDetail + quotation.other_amount,
          status: QUOTATION_STATUS.PENDING,
          created_at: new Date(),
          updated_at: new Date(),
        },
        include: {
          details: true,
        },
      });
    });

    return `quotation with id ${id} approved and sales order created`;
  }

  remove(id: number) {
    return `This action removes a #${id} quotation`;
  }
}
