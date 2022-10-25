import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { addMonths, format } from 'date-fns';
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

    let allCreated = [];
    if (
      createTransactionDto.installments &&
      Number(createTransactionDto.quantity) > 1
    ) {
      const quantities = Number(createTransactionDto.quantity);
      let dateChanged: string;
      for (let q = 0; q < quantities; q++) {
        const getCurrentDate = new Date(createTransactionDto.date);
        if (q === 0) {
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
          allCreated.push(created);
        } else {
          const moreOneMonth =
            q === 1
              ? addMonths(getCurrentDate, 1)
              : addMonths(new Date(dateChanged), 1);
          dateChanged = format(moreOneMonth, "yyyy-MM-dd'T'HH:mm:ss.SSS") + 'Z';
          const created = await this.prismaService.transactions.create({
            data: {
              date: dateChanged,
              price: createTransactionDto.price,
              title: createTransactionDto.title,
              profileId: profileId[0].id,
              categoriesId: categoryId.id,
            },
          });
          delete created.categoriesId;
          delete created.profileId;
          allCreated.push(created);
        }
      }
    } else {
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
      allCreated.push(created);
    }

    return allCreated;
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
