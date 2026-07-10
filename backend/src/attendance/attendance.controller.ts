import { Controller, Post, Param, Get, ParseIntPipe ,Query} from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // ✅ Check-in
  @Post('check-in/:employeeId')
  checkIn(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.attendanceService.checkIn(employeeId);
  }

  // ✅ Check-out
  @Post('check-out/:employeeId')
  checkOut(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.attendanceService.checkOut(employeeId);
  }

  // ✅ Get all attendance
  @Get()
findAll(@Query('employeeId') employeeId?: string) {
  if (employeeId) {
    return this.attendanceService.findByEmployee(Number(employeeId));
  }

  return this.attendanceService.findAll();
}
@Get(':employeeId')
findByEmployee(
  @Param('employeeId', ParseIntPipe) employeeId: number,
) {
  return this.attendanceService.findByEmployee(employeeId);
}
}