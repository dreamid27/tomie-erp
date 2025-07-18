import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.customer.findMany();
  }

  findByRole(userRole: string, customerId?: string) {
    if (userRole === 'sales') {
      // Sales users can see all customers
      return this.prisma.customer.findMany();
    } else if (userRole === 'customer' && customerId) {
      // Customer users can only see their own customer record
      return this.prisma.customer.findMany({
        where: { id: customerId },
      });
    } else {
      // Default case - return empty array for security
      return [];
    }
  }
}
