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
  @ApiProperty({
    description: 'Product ID',
    example: 'c9b368eb-f290-45fa-87e5-71d950e9aa6b',
  })
  @IsString()
  product_id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Wireless Mouse',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Note of the item',
    example: 'This is a note',
  })
  @IsString()
  note: string;

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
    example: '9bb580ac-067c-4f97-b344-34ebe213ae7f',
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
      {
        product_id: 'c9b368eb-f290-45fa-87e5-71d950e9aa6b',
        description: 'Mechanical Keyboard',
        note: 'This is a note',
        unit_price: 10000,
        qty: 1,
      },
      {
        product_id: '2d972346-92af-4a6d-8e11-a5edde038823',
        description: 'Mechanical Keyboard',
        note: '',
        unit_price: 10000,
        qty: 2,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetailDto)
  details: DetailDto[];
}
