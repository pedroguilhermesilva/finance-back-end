import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prismaService: PrismaService) {}
  async create(createTransactionDto: CreateTransactionDto) {
    const profileId = await this.prismaService.profiles.findMany({
      where: {
        userId: createTransactionDto.userId,
      },
    });
    const categoryId = await this.prismaService.categories.findUnique({
      where: {
        id: createTransactionDto.categoryId,
      },
    });

    const created = await this.prismaService.transactions.create({
      data: {
        date: createTransactionDto.date,
        price: createTransactionDto.price,
        title: createTransactionDto.title,
        profileId: profileId[0].id,
        categoriesId: categoryId.id,
      },
    });

    delete created.categoriesId;
    delete created.profileId;

    return created;
  }

  findAll() {
    return this.prismaService.transactions.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
