import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignUpInput {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
