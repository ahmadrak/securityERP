import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private db: DatabaseService) {}

  // 🔥 Create user
  async create(data: any) {
    const { email, password, role, employeeId } = data;

    if (!email || !password) {
      throw new Error('Email and password required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.db.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || 'GUARD',
        employeeId: employeeId || null,
      },
    });
  }

  // 🔥 Get all users
  async findAll() {
    return this.db.user.findMany({
      include: {
        employee: true, // if relation exists
      },
    });
  }

  // 🔥 Get user by id
  async findOne(id: number) {
    return this.db.user.findUnique({
      where: { id },
      include: {
        employee: true,
      },
    });
  }

  // 🔥 Delete user
  async remove(id: number) {
    return this.db.user.delete({
      where: { id },
    });
  }
}