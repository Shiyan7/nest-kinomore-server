import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class PasswordService {
  validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }
}
