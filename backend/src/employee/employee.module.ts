import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { DatabaseModule } from '../database/database.module';
import { S3Module } from '../s3/s3.module'; // import S3Module

@Module({
  imports: [DatabaseModule,S3Module],
  providers: [EmployeeService],
  controllers: [EmployeeController],
})
export class EmployeeModule {}