import { Controller, Post, Param, Get, ParseIntPipe ,Query, Req, ForbiddenException} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UseGuards } from '@nestjs/common';


@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}
  
  @Roles('ADMIN','GUARD')
  // ✅ Check-in
  @Post('check-in/:employeeId')
  checkIn(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Req() req: any,
  ) {
    if (req.user.role === 'GUARD' && req.user.employeeId !== employeeId) {
      throw new ForbiddenException('You can only check in for yourself');
    }
    return this.attendanceService.checkIn(employeeId);
  }

  // ✅ Check-out
  @Roles('ADMIN','GUARD')
  @Post('check-out/:employeeId')
  checkOut(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Req() req: any,
  ) {
    if (req.user.role === 'GUARD' && req.user.employeeId !== employeeId) {
      throw new ForbiddenException('You can only check out for yourself');
    }
    return this.attendanceService.checkOut(employeeId);
  }

  // ✅ Get all attendance
  @Roles('ADMIN', 'SUPERVISOR')
  @Get()
findAll(
  @Query('employeeId') employeeId?: string,
  @Query('active') active?: string,
  @Query('date') date?: string,
  @Query('month') month?: string,
  @Query('locationId') locationId?: string,
) {
  if (month) {
    return this.attendanceService.findMonthlySummary(month, locationId);
  }
  if (date) {
    return this.attendanceService.findRoster(date, locationId);
  }
  if (active === 'true') {
    return this.attendanceService.findActive();
  }
  if (employeeId) {
    return this.attendanceService.findByEmployee(Number(employeeId));
  }

  return this.attendanceService.findAll();
}
@Roles('ADMIN', 'SUPERVISOR','GUARD')
@Get(':employeeId')
findByEmployee(
  @Param('employeeId', ParseIntPipe) employeeId: number,
  @Req() req: any,
) {
  if (req.user.role === 'GUARD' && req.user.employeeId !== employeeId) {
    throw new ForbiddenException('You can only view your own attendance');
  }
  return this.attendanceService.findByEmployee(employeeId);
}
}