import { Module } from '@nestjs/common';
import { SalesOrderService } from './sales-order.service';
import { SalesOrderController } from './sales-order.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SalesOrderController],
  providers: [SalesOrderService, PrismaService],
})
export class SalesOrderModule {}
