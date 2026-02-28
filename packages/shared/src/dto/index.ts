import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../constants';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class CreateAddressDto {
  @IsString()
  @MinLength(5)
  street: string;

  @IsString()
  @MinLength(2)
  city: string;

  @IsString()
  @MinLength(2)
  state: string;

  @IsString()
  @MinLength(2)
  country: string;

  @IsString()
  @MinLength(5)
  zipCode: string;

  @IsOptional()
  @IsString()
  apartment?: string;

  @IsOptional()
  @IsString()
  label?: string;
}

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

export class CreateOrderDto {
  @IsString()
  @MinLength(1)
  items: CreateOrderItemDto[];

  @IsString()
  shippingAddressId: string;

  @IsOptional()
  @IsString()
  couponCode?: string;
}

export class CreateOrderItemDto {
  @IsString()
  productId: string;

  @IsOptional()
  quantity: number;

  @IsOptional()
  price: number;
}

export class CreatePaymentDto {
  @IsString()
  orderId: string;

  @IsString()
  @IsEnum(['stripe', 'paypal'])
  paymentMethod: string;
}
