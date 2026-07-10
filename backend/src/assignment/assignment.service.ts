import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AssignmentService {
  constructor(private db: DatabaseService) {}

async create(dto: any) {
  if (!dto.employeeId) {
    throw new BadRequestException('Employee is required');
  }

  // only enforce location for permanent
  if (dto.type === 'PERMANENT' && !dto.locationId) {
    throw new BadRequestException('Permanent assignment requires location');
  }

  return this.db.assignment.create({
    data: {
      employeeId: Number(dto.employeeId),
      type: dto.type,

      // ✅ KEEP location even in vacation
      locationId: dto.locationId || null,
      contractId: dto.contractId || null,

      startDate: dto.startDate ? new Date(dto.startDate) : null,
      endDate: dto.endDate ? new Date(dto.endDate) : null,
    },
  });
}

async findAll() {
  return this.db.assignment.findMany({
    include: {
      employee: true,
      location: {
        include: {
          contract: {
            include: {
              client: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}


async findOne(id: string) {
  return this.db.assignment.findUnique({
    where: { id },
    include: {
      employee: true,
      location: {
        include: {
          contract: {
            include: {
              client: true,
            },
          },
        },
      },
      contract: true,
    },
  });
}

  async remove(id: string) {
    return this.db.assignment.delete({
      where: { id },
    });
  }
}