import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { QuotationService } from './quotation.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { SalesAuthGuard } from 'src/auth/sales-auth.guard';
import { PaginationParamsDto } from './dto/pagination-params.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('quotation')
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createQuotationDto: CreateQuotationDto, @Request() req: any) {
    const user = req.user?.username || 'unknown';
    return this.quotationService.create(createQuotationDto, user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'excludeStatus', required: false, type: String })
  findAll(
    @Query()
    {
      page = 1,
      pageSize = 10,
      status,
      excludeStatus,
    }: PaginationParamsDto & { status?: string; excludeStatus?: string },
    @Request() req: any,
  ) {
    const user = req.user;
    return this.quotationService.findAll({
      page: Number(page),
      pageSize: Number(pageSize),
      status,
      excludeStatus,
      userRole: user?.role,
      customerId: user?.customer_id,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    const user = req.user;
    return this.quotationService.findOne(id, user?.role, user?.customer_id);
  }

  @ApiBearerAuth()
  @UseGuards(SalesAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuotationDto: UpdateQuotationDto,
    @Request() req: any,
  ) {
    const user = req.user?.username || 'unknown';
    return this.quotationService.update(id, updateQuotationDto, user);
  }
}
