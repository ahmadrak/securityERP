import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';

type PayrollResult = {
  employee: string;
  present: number;
  absent: number;
  off: number;
  baseSalary: number;
  deductions: number;
  finalSalary: number;
};

@Injectable()
export class PayrollService {
  constructor(private db: DatabaseService) {}

  async generate(month: string) {
    const [year, monthNum] = month.split('-').map(Number);

    // 🔥 safe month range
    const start = new Date(Date.UTC(year, monthNum - 1, 1));
    const end = new Date(Date.UTC(year, monthNum, 1));

    const daysInMonth = new Date(year, monthNum, 0).getDate();

    const employees = await this.db.employee.findMany();

    const result: PayrollResult[] = [];

    for (const emp of employees) {
      console.log('EMPLOYEE:', emp.name);

      const attendance = await this.db.attendance.findMany({
        where: {
          employeeId: emp.id,
          date: {
            gte: start,
            lt: end,
          },
        },
      });

      let present = 0;
      let absent = 0;
      let off = 0;

      for (const a of attendance) {
        const status = a.status?.toLowerCase();

        if (status === 'present') present++;
        else if (status === 'absent') absent++;
        else if (status === 'off') off++;
      }

      // 🔥 IMPORTANT FIX: missing days = absent
      const recordedDays = present + absent + off;
      const missingDays = Math.max(0, daysInMonth - recordedDays);

      const totalAbsent = absent + missingDays;

      const baseSalary = emp.salary || 0;
      const dailySalary = baseSalary / daysInMonth;

      const deductions = totalAbsent * dailySalary;

      const finalSalary = Math.max(0, baseSalary - deductions);

      result.push({
        employee: emp.name,
        present,
        absent: totalAbsent,
        off,
        baseSalary,
        deductions,
        finalSalary,
      });
    }

    return result;
  }

  async create(dto: Prisma.PayrollCreateInput) {
    return this.db.payroll.create({
      data: dto,
    });
  }

  async findAll() {
    return this.db.payroll.findMany({
      include: { employee: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.db.payroll.findUnique({
      where: { id },
      include: { employee: true },
    });
  }

  async remove(id: string) {
    return this.db.payroll.delete({
      where: { id },
    });
  }
}