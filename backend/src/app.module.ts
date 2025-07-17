import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { QuotationModule } from './quotation/quotation.module';
import { SalesOrderModule } from './sales-order/sales-order.module';
import { PrismaService } from './prisma.service';
import { ProductModule } from './product/product.module';

@Module({
  imports: [ConfigModule.forRoot(), QuotationModule, SalesOrderModule, ProductModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
