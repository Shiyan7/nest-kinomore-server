import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  googleId?: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password?: string;

  @IsString()
  avatar: string;
}
