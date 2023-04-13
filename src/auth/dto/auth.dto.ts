import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Пароль должен быть больше 6 символов' })
  @MaxLength(72, { message: 'Пароль должен быть меньше 72 символов' })
  password: string;
}
