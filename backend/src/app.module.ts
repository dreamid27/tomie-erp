import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { QuotationModule } from './quotation/quotation.module';
import { SalesOrderModule } from './sales-order/sales-order.module';

@Module({
  imports: [ConfigModule.forRoot(), QuotationModule, SalesOrderModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
