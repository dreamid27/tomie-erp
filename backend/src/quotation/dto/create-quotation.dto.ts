import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsUUID,
  IsOptional,
  IsNumber,
  ValidateNested,
  IsArray,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class DetailDto {
  @ApiProperty({ description: 'Description of the item' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Unit price of the item' })
  @IsNumber()
  @Min(0)
  unit_price: number;

  @ApiProperty({ description: 'Quantity of the item' })
  @IsNumber()
  qty: number;
}

export class CreateQuotationDto {
  @ApiProperty({ description: 'Order code' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Order date in ISO8601 format' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Customer UUID' })
  @IsUUID()
  customer_id: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ description: 'Other amount in the order' })
  @IsNumber()
  @Min(0)
  other_amount: number;

  @ApiProperty({ type: [DetailDto], description: 'Order details' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetailDto)
  details: DetailDto[];
}
