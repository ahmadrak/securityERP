import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsInt } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsEmail({}, { message: 'البريد الإلكتروني غير صحيح' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'كلمة المرور لازم تكون 8 أحرف على الأقل' })
  password!: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'role غير صحيح' })
  role?: UserRole;

  @IsOptional()
  @IsInt()
  employeeId?: number;
}
