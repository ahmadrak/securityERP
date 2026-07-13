import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { Prisma } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';


@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: Prisma.PayrollCreateInput) {
    return this.payrollService.create(dto);
  }

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.payrollService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN')
  findOne(@Param('id') id: string) {
    return this.payrollService.findOne(id);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.payrollService.remove(id);
  }
  @Post('generate')
  @Roles('ADMIN')
generate(@Body() body: { month: string }) {
  return this.payrollService.generate(body.month);
}
}