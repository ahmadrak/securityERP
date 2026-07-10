import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { Prisma } from '@prisma/client';

@Controller('assignments')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post()
  create(@Body() dto: Prisma.AssignmentCreateInput) {
    return this.assignmentService.create(dto);
  }

  @Get()
  findAll() {
    return this.assignmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignmentService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignmentService.remove(id);
  }
}