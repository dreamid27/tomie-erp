import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SalesOrderService } from './sales-order.service';
import { UpdateSalesOrderDto } from './dto/update-sales-order.dto';
import { PaginationParamsDto } from '../quotation/dto/pagination-params.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('sales-order')
export class SalesOrderController {
  constructor(private readonly salesOrderService: SalesOrderService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  findAll(
    @Query()
    {
      page = 1,
      pageSize = 10,
      status,
    }: PaginationParamsDto & { status?: string },
  ) {
    return this.salesOrderService.findAll({
      page: Number(page),
      pageSize: Number(pageSize),
      status,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesOrderService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSalesOrderDto: UpdateSalesOrderDto,
  ) {
    return this.salesOrderService.update(+id, updateSalesOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesOrderService.remove(+id);
  }
}
