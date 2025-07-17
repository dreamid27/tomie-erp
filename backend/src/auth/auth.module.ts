import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { SalesAuthGuard } from './sales-auth.guard';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'DREAMID27XFARISHERE',
      signOptions: { expiresIn: '30d' },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthGuard, AuthService, SalesAuthGuard],
  exports: [AuthGuard, SalesAuthGuard],
})
export class AuthModule {}
