import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { Prisma } from '@prisma/client';

@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post()
  create(@Body() dto: Prisma.PayrollCreateInput) {
    return this.payrollService.create(dto);
  }

  @Get()
  findAll() {
    return this.payrollService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.payrollService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.payrollService.remove(id);
  }
  @Post('generate')
generate(@Body() body: { month: string }) {
  return this.payrollService.generate(body.month);
}
}