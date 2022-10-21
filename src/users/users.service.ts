import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prismaService.users.create({
      data: createUserDto,
    });
  }

  findAll() {
    return this.prismaService.users.findMany({
      include: { category: true, transactions: true },
    });
  }

  findOne(email: string) {
    return this.prismaService.users.findUniqueOrThrow({
      where: { email },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(email: string) {
    return this.prismaService.users.delete({
      where: { email },
    });
  }
}
