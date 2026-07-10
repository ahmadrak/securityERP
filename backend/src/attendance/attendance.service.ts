import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AttendanceService {
  constructor(private db: DatabaseService) {}

  // ✅ Check-in
  async checkIn(employeeId: number) {
    // Check if already checked in (no checkout yet)
    const existing = await this.db.attendance.findFirst({
      where: {
        employeeId,
        checkOut: null,
      },
    });

    if (existing) {
      throw new BadRequestException('Employee already checked in');
    }

    return this.db.attendance.create({
  data: {
    employeeId,
    checkIn: new Date(),
    date: new Date(), // ✅ أضف هذا
  },
});
  }

  // ✅ Check-out
  async checkOut(employeeId: number) {
    const record = await this.db.attendance.findFirst({
      where: {
        employeeId,
        checkOut: null,
      },
    });

    if (!record) {
      throw new BadRequestException('No active check-in found');
    }

    return this.db.attendance.update({
      where: { id: record.id },
      data: {
        checkOut: new Date(),
      },
    });
  }

  // ✅ Get all attendance
    async findAll(employeeId?: number) {
         return this.db.attendance.findMany({
           where: {
             employeeId,
               },
                orderBy: {
                       date: 'asc',
                         },
                 });
}
async findByEmployee(employeeId: number) {
  return this.db.attendance.findMany({
    where: {
      employeeId,
    },
    orderBy: {
      date: 'asc',
    },
  });
}
}