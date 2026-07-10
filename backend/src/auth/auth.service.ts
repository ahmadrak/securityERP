import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwt: JwtService,
  ) {}

  // ✅ Register
  async register(email: string, password: string) {
    const existing = await this.db.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.db.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return { message: 'User created successfully', user };
  }

  // ✅ Login
  async login(email: string, password: string) {
    console.log(email,password);
    const user = await this.db.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwt.sign({
      userId: user.id,
      role: user.role,
      employeeId: user.employeeId
    });

    return {
      access_token: token,
     user: {
    id: user.id,
    employeeId: user.employeeId,
    email: user.email,
    role: user.role,
  },
    };
  }
}