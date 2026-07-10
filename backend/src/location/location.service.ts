import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LocationService {
  constructor(private db: DatabaseService) {}

  async create(dto: Prisma.LocationCreateInput) {
    return this.db.location.create({
      data: dto,
    });
  }

  async findAll() {
    return this.db.location.findMany({
  include: {
    contract: {
      include: {
        client: true,
      },
    },
  }
})
  }


findOne(id: string) {
  return this.db.location.findUnique({
    where: { id },
    include: {
   contract: {
    include: {
      client: true,
    },
  },
  assignments: {
    include: {
      employee: true,
    },
  },
}});
}

  async update(id: string, dto: Prisma.LocationUpdateInput) {
    return this.db.location.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.db.location.delete({
      where: { id },
    });
  }
}