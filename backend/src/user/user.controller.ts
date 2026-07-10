import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 🔥 Create user (manual if needed)
  @Post()
  create(@Body() body: any) {
    return this.userService.create(body);
  }

  // 🔥 Get all users
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // 🔥 Get single user
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(Number(id));
  }

  // 🔥 Delete user
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(Number(id));
  }
}