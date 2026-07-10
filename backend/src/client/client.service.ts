import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClientService {
  constructor(private db: DatabaseService) {}

  async create(dto: Prisma.ClientCreateInput) {
    return this.db.client.create({ data: dto });
  }

  async findAll() {
    return this.db.client.findMany();
  }

  async findOne(id: string) {
    return this.db.client.findUnique({ where: { id } });
  }

  async update(id: string, dto: Prisma.ClientUpdateInput) {
    return this.db.client.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return this.db.client.delete({ where: { id } });
  }
}