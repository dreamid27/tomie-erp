import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { PrismaService } from 'src/prisma.service';
import { QUOTATION_STATUS } from './status.enum';

@Injectable()
export class QuotationService {
  constructor(private prisma: PrismaService) {}

  generateQuotationCode(customerUUID: string) {
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

    // Format akhir
    const quotationCode = `QTN/${year}/${month}/${day}/${clientCode}-${uniqueNum}`;
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

    let quotationCode = this.generateQuotationCode(customer.id);
    let isCodeExist = !!(await this.prisma.quotation.findFirst({
      where: {
        code: quotationCode,
      },
    }));

    while (isCodeExist) {
      quotationCode = this.generateQuotationCode(customer.id);
      isCodeExist = !!(await this.prisma.quotation.findFirst({
        where: {
          code: quotationCode,
        },
      }));
    }

    const details = createQuotationDto.details.map((detail) => ({
      description: detail.description,
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
        code: this.generateQuotationCode(customer.id),
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

  findAll() {
    return this.prisma.quotation.findMany();
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

      // TODO: create sales order
    });
  }

  remove(id: number) {
    return `This action removes a #${id} quotation`;
  }
}
