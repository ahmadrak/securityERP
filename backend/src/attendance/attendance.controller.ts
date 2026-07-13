import { Controller, Post, Param, Get, ParseIntPipe ,Query} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UseGuards } from '@nestjs/common';


@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}
  
  @Roles('ADMIN')
  // ✅ Check-in
  @Post('check-in/:employeeId')
  checkIn(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.attendanceService.checkIn(employeeId);
  }

  // ✅ Check-out
  @Roles('ADMIN')
  @Post('check-out/:employeeId')
  checkOut(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.attendanceService.checkOut(employeeId);
  }

  // ✅ Get all attendance
  @Roles('ADMIN', 'SUPERVISOR')
  @Get()
findAll(@Query('employeeId') employeeId?: string) {
  if (employeeId) {
    return this.attendanceService.findByEmployee(Number(employeeId));
  }

  return this.attendanceService.findAll();
}
@Roles('ADMIN', 'SUPERVISOR')
@Get(':employeeId')
findByEmployee(
  @Param('employeeId', ParseIntPipe) employeeId: number,
) {
  return this.attendanceService.findByEmployee(employeeId);
}
}