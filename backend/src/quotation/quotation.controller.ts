import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { QuotationService } from './quotation.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { SalesAuthGuard } from 'src/auth/sales-auth.guard';
import { PaginationParamsDto } from './dto/pagination-params.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@Controller('quotation')
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  @Post()
  create(@Body() createQuotationDto: CreateQuotationDto) {
    return this.quotationService.create(createQuotationDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  findAll(@Query() { page = 1, pageSize = 10 }: PaginationParamsDto) {
    return this.quotationService.findAll({
      page: Number(page),
      pageSize: Number(pageSize),
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotationService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(SalesAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuotationDto: UpdateQuotationDto,
  ) {
    return this.quotationService.update(id, updateQuotationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quotationService.remove(+id);
  }
}
