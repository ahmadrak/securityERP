import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'البريد الإلكتروني غير صحيح' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'كلمة المرور لازم تكون 8 أحرف على الأقل' })
  password!: string;
}