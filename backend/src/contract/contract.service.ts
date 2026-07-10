import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ContractService {
  constructor(private db: DatabaseService) {}

  async create(dto: Prisma.ContractCreateInput) {
    return this.db.contract.create({ data: dto });
  }

  async findAll() {
    return this.db.contract.findMany({
      include: { client: true, locations: true },
    });
  }

  async findOne(id: string) {
    return this.db.contract.findUnique({
      where: { id },
      include: { client: true, locations: true },
    });
  }

  async update(id: string, dto: Prisma.ContractUpdateInput) {
    return this.db.contract.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return this.db.contract.delete({ where: { id } });
  }
}