import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientService } from './client.service';
import { Prisma } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';



@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: Prisma.ClientCreateInput) {
    return this.clientService.create(dto);
  }

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.clientService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'SUPERVISOR')
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: Prisma.ClientUpdateInput) {
    return this.clientService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.clientService.remove(id);
  }
}