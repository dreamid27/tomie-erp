import { Injectable, BadRequestException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SalesOrderService {
  constructor(private prisma: PrismaService) {}

  async findAll({
    page = 1,
    pageSize = 10,
    status,
  }: {
    page: number;
    pageSize: number;
    status?: string;
  }) {
    try {
      const skip = (page - 1) * pageSize;

      // Build where clause for filtering
      const whereClause: any = {};

      if (status) {
        whereClause.status = status;
      }

      const [total, data] = await Promise.all([
        this.prisma.sales_order.count({ where: whereClause }),
        this.prisma.sales_order.findMany({
          where: whereClause,
          include: {
            details: true,
          },
          skip,
          take: pageSize,
          orderBy: {
            created_at: 'desc', // Most recent first
          },
        }),
      ]);

      const totalPages = Math.ceil(total / pageSize);

      return {
        data,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
      };
    } catch (error) {
      console.error(
        `Error fetching paginated sales orders: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to fetch sales orders');
    }
  }

  findOne(id: string) {
    return this.prisma.sales_order.findUniqueOrThrow({
      where: {
        id: id,
      },
      include: {
        details: true,
      },
    });
  }
}
