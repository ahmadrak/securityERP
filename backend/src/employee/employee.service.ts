import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { EmployeeType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

function generatePassword(length = 8) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
}

@Injectable()
export class EmployeeService {
  constructor(private db: DatabaseService) {}

  // ================= CREATE EMPLOYEE =================
  async create(data: any) {
    const { createUser, email, ...employeeData } = data;
    console.log('BODY RECEIVED:', data);

    const shouldCreateUser = String(createUser) === 'true';

    // 1️⃣ create employee
    const employee = await this.db.employee.create({
      data: {
        ...employeeData,
      },
    });

    let tempPassword: string | null = null;
    let user: any = null;

    // 2️⃣ create user if needed
    if (shouldCreateUser) {
      if (!email) {
        throw new BadRequestException('Email is required to create user');
      }

      // check duplicate email
      const existingUser = await this.db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new BadRequestException('User already exists with this email');
      }

      tempPassword = generatePassword(10);

      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      user = await this.db.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'GUARD',
          employeeId: employee.id,
        },
      });
      console.log('✅ USER CREATED:', user);
    }

    return {
      employee,
      user,
      tempPassword,
    };
  }

  // ================= GET ALL =================
  async findAll(type?: EmployeeType) {
    return this.db.employee.findMany({
      where: type ? { type } : undefined,
    });
  }

  // ================= GET ONE =================
  async findOne(id: number) {
    return this.db.employee.findUnique({
      where: { id },
      include: {
        user: true, // 👈 مهم عشان تشوف الربط
      },
    });
  }

  // ================= UPDATE =================
  async update(id: number, data: any) {
    const {
      name,
      email,
      type,
      salary,
      fileNumber,
      phoneNumber,
      whatsapp,
      psbdNumber,
      startDate,
      birthDate,
      psbdExpiry,
    } = data;

    return this.db.employee.update({
      where: { id },
      data: {
        name,
        email,
        type,
        salary: salary ? Number(salary) : undefined,
        fileNumber,
        phoneNumber,
        whatsapp,
        psbdNumber,
        startDate: startDate ? new Date(startDate) : undefined,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        psbdExpiry: psbdExpiry ? new Date(psbdExpiry) : undefined,
      },
    });
  }

  // ================= DELETE =================
  async remove(id: number) {
    await this.db.assignment.deleteMany({
      where: { employeeId: id },
    });

    await this.db.user.deleteMany({
      where: { employeeId: id },
    });

    return this.db.employee.delete({
      where: { id },
    });
  }
}