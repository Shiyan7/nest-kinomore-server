import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class SignInInput {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Пароль должен быть больше 6 символов' })
  password: string;
}
