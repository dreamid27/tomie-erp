import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateQuotationDto } from './create-quotation.dto';
import { IsEnum, IsString } from 'class-validator';
import { QUOTATION_STATUS } from '../status.enum';

export class UpdateQuotationDto {
  @ApiProperty({
    description: 'Status of the quotation',
    enum: QUOTATION_STATUS,
    example: QUOTATION_STATUS.APPROVED,
  })
  @IsEnum(QUOTATION_STATUS)
  status?: QUOTATION_STATUS;
}
