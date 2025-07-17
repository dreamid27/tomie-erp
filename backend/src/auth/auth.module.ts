import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { SalesAuthGuard } from './sales-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'DREAMID27XFARISHERE',
    }),
  ],
  controllers: [],
  providers: [AuthGuard, SalesAuthGuard],
  exports: [AuthGuard, SalesAuthGuard],
})
export class AuthModule {}
