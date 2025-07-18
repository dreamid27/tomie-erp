import { Module } from '@nestjs/common';
import { QuotationService } from './quotation.service';
import { QuotationController } from './quotation.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { AuditService } from './services/audit.service';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [QuotationController],
  providers: [QuotationService, PrismaService, AuditService],
})
export class QuotationModule {}
