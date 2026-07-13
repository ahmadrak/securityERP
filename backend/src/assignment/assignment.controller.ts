import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { Prisma } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';


@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('assignments')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Roles('ADMIN')
  @Post()
  create(@Body() dto: Prisma.AssignmentCreateInput) {
    return this.assignmentService.create(dto);
  }
  @Roles('ADMIN', 'SUPERVISOR')
  @Get()
  findAll() {
    return this.assignmentService.findAll();
  }
  @Roles('ADMIN', 'SUPERVISOR')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignmentService.findOne(id);
  }
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignmentService.remove(id);
  }
}