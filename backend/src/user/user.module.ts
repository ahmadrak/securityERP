import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule], // 👈 هذا هو الحل
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}