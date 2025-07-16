import { Injectable } from '@nestjs/common';
import { CreateSalesOrderDto } from './dto/create-sales-order.dto';
import { UpdateSalesOrderDto } from './dto/update-sales-order.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SalesOrderService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.sales_order.findMany({
      include: {
        details: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.sales_order.findUniqueOrThrow({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateSalesOrderDto: UpdateSalesOrderDto) {
    return `This action updates a #${id} salesOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} salesOrder`;
  }
}
