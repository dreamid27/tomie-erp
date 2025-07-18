import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { AuthGuard } from 'src/auth/auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    username: string;
    role: string;
    customer_id?: string;
  };
}

@Controller('customer')
@UseGuards(AuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    const user = req.user;
    return this.customerService.findByRole(user.role, user.customer_id);
  }
}
