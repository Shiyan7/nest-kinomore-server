import { IsEmail, IsString, MaxLength } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(72, { message: 'Пароль должен быть меньше 72 символов' })
  password: string;
}
