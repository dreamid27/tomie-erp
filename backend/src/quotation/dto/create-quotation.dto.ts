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
  @ApiProperty({ description: 'Order code', example: 'Q-0001' })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Order date in ISO8601 format',
    example: '2025-07-16T08:45:59+00:00',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Customer UUID',
    example: 'c430b4b5-9d1a-42d8-a01d-28e463c36460',
  })
  @IsUUID()
  customer_id: string;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'This is a note',
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ description: 'Other amount in the order', example: 20000 })
  @IsNumber()
  @Min(0)
  other_amount: number;

  @ApiProperty({
    type: [DetailDto],
    description: 'Order details',
    example: [
      { description: 'Item 1', unit_price: 10000, qty: 1 },
      { description: 'Item 2', unit_price: 10000, qty: 2 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetailDto)
  details: DetailDto[];
}
