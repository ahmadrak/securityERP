import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';



@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 🔥 Create user (manual if needed)
  @Post()
  @Roles('ADMIN')
  create(@Body() body: any) {
    return this.userService.create(body);
  }

  // 🔥 Get all users
  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.userService.findAll();
  }

  // 🔥 Get single user
  @Get(':id')
  @Roles('ADMIN')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(Number(id));
  }

  // 🔥 Delete user
  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.userService.remove(Number(id));
  }
}