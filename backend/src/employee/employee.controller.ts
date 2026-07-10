import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeType, Prisma } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../s3/s3.service';
import multer from 'multer';
export class CreateEmployeeDto {
  name!: string;
  email?: string;
  phone?: string;
  nationality?: string;
  type!: EmployeeType;
  fileNumber!: string;
  salary?: number;
  phoneNumber?: string;
  whatsapp?: string;
  psbdNumber?: string;
  startDate?: string;
  birthDate?: string;
  psbdExpiry?: string;
  createUser?: string;
}

@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService,
    private readonly s3Service: S3Service, // ✅ ADD THIS
  ) {}
  
  @Post()
  @Roles('ADMIN')
  @UseInterceptors(
  FileFieldsInterceptor(
    [
      { name: 'emaratesId', maxCount: 1 },
      { name: 'psbdId', maxCount: 1 },
      { name: 'contract', maxCount: 1 },
      { name: 'nsiCert', maxCount: 1 },
      { name: 'pic', maxCount: 1 },
      { name: 'passport', maxCount: 1 },
    ],
    {
      storage: multer.memoryStorage(), // 🔥 use your S3 uploader
    },
  ),
)
async create(
  @Body() body: CreateEmployeeDto,
  @UploadedFiles() files: any,
) {
console.log('BODY:', body);
console.log('FILES:', files);
 return this.employeeService.create({
    name: body.name,
    email: body.email || null,
    phone: body.phone || null,
    type: body.type,
    createUser: body.createUser,
    fileNumber: body.fileNumber,
    nationality: body.nationality || null,
    phoneNumber: body.phoneNumber || null,
    whatsapp: body.whatsapp || null,
    psbdNumber: body.psbdNumber || null,
    salary: body.salary ? Number(body.salary) : null,
    startDate: body.startDate ? new Date(body.startDate) : null,
    birthDate: body.birthDate ? new Date(body.birthDate) : null,
    psbdExpiry: body.psbdExpiry ? new Date(body.psbdExpiry) : null,

    // 🔥 THIS IS THE FIX (upload to S3)
    emaratesId: files?.emaratesId
      ? await this.s3Service.uploadFile(files.emaratesId[0], 'employees')
      : null,

    psbdId: files?.psbdId
      ? await this.s3Service.uploadFile(files.psbdId[0], 'employees')
      : null,

    contract: files?.contract
      ? await this.s3Service.uploadFile(files.contract[0], 'employees')
      : null,

    nsiCert: files?.nsiCert
      ? await this.s3Service.uploadFile(files.nsiCert[0], 'employees')
      : null,

    pic: files?.pic
      ? await this.s3Service.uploadFile(files.pic[0], 'employees')
      : null,

    passport: files?.passport
      ? await this.s3Service.uploadFile(files.passport[0], 'employees')
      : null,
  });
}

  @Get()
  @Roles('ADMIN', 'SUPERVISOR')
  findAll(@Query('type') type?: EmployeeType) {
    return this.employeeService.findAll(type);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Prisma.EmployeeUpdateInput) {
    return this.employeeService.update(id, dto); // pass the full object
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.remove(id);
  }
}