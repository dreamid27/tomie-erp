import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { QuotationModule } from './quotation/quotation.module';
import { SalesOrderModule } from './sales-order/sales-order.module';
import { PrismaService } from './prisma.service';
import { ProductModule } from './product/product.module';
import { CustomerModule } from './customer/customer.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    QuotationModule,
    SalesOrderModule,
    ProductModule,
    CustomerModule,
    AuthModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: 'DREAMID27XFARISHERE',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
