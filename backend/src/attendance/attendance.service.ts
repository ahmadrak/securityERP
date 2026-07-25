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

  // ✅ Monthly summary: كم يوم حضر وكم يوم غاب كل موظف بشهر معين — تستخدمها صفحة الويب
  async findMonthlySummary(monthStr: string, locationId?: string) {
    // monthStr شكلها "2026-07"
    const [year, month] = monthStr.split('-').map(Number);
    const start = new Date(year, month - 1, 1);
    const nextMonth = new Date(year, month, 1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // لا نحسب أيام مستقبلية إذا الشهر المطلوب هو الشهر الحالي
    const end = nextMonth < tomorrow ? nextMonth : tomorrow;
    const daysElapsed = Math.max(
      0,
      Math.round((end.getTime() - start.getTime()) / 86400000),
    );

    const assignments = await this.db.assignment.findMany({
      where: {
        endDate: null,
        ...(locationId ? { locationId } : {}),
      },
      include: { employee: true },
    });

    const employeeIds = assignments.map((a) => a.employeeId);

    const attendanceRecords = await this.db.attendance.findMany({
      where: {
        employeeId: { in: employeeIds },
        date: { gte: start, lt: end },
        checkIn: { not: null },
      },
      select: { employeeId: true },
    });

    const presentCountByEmployee = new Map<number, number>();
    for (const rec of attendanceRecords) {
      presentCountByEmployee.set(
        rec.employeeId,
        (presentCountByEmployee.get(rec.employeeId) ?? 0) + 1,
      );
    }

    return assignments.map((a) => {
      const presentDays = presentCountByEmployee.get(a.employeeId) ?? 0;
      const leaveDays = Math.max(0, daysElapsed - presentDays);
      return {
        employee: a.employee,
        assignmentType: a.type,
        presentDays,
        leaveDays,
        totalDays: daysElapsed,
      };
    });
  }
  async findActive() {
    return this.db.attendance.findMany({
      where: { checkOut: null },
      include: { employee: true, location: true },
      orderBy: { checkIn: 'desc' },
    });
  }

  // ✅ Daily roster: كل موظف معين + حالة حضوره باليوم المطلوب — تستخدمها صفحة الويب
  async findRoster(dateStr: string, locationId?: string) {
    const start = new Date(dateStr);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const assignments = await this.db.assignment.findMany({
      where: {
        endDate: null, // تكليفات نشطة بس
        ...(locationId ? { locationId } : {}),
      },
      include: { employee: true },
    });

    const employeeIds = assignments.map((a) => a.employeeId);

    const attendanceRecords = await this.db.attendance.findMany({
      where: {
        employeeId: { in: employeeIds },
        date: { gte: start, lt: end },
      },
    });

    const attendanceByEmployee = new Map(
      attendanceRecords.map((rec) => [rec.employeeId, rec]),
    );

    return assignments.map((a) => {
      const attendance = attendanceByEmployee.get(a.employeeId);
      return {
        employee: a.employee,
        assignmentType: a.type,
        attendance: attendance
          ? { checkIn: attendance.checkIn, checkOut: attendance.checkOut }
          : undefined,
      };
    });
  }
}