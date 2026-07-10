import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { ClientModule } from './client/client.module';
import { ContractModule } from './contract/contract.module';
import { LocationModule } from './location/location.module';
import { AssignmentModule } from './assignment/assignment.module';
import { AttendanceModule } from './attendance/attendance.module';
import { PayrollModule } from './payroll/payroll.module';
import { AuthModule } from './auth/auth.module';
import { S3Module } from './s3/s3.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [EmployeeModule, DatabaseModule, ClientModule, ContractModule, LocationModule, AssignmentModule, AttendanceModule, PayrollModule, AuthModule, S3Module, UserModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
