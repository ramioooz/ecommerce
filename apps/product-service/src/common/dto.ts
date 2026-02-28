import { IsString, MinLength, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  description: string;

  @IsString()
  @MinLength(3)
  slug: string;

  @IsString()
  sku: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  images?: string[];

  @IsOptional()
  price?: number;

  @IsOptional()
  stock?: number;
}

export class CreateCategoryDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  parentId?: string;
}