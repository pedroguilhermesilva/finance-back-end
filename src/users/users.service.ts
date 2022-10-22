import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existedUser = await this.prismaService.users.findUnique({
      where: {
        id: createUserDto.id,
      },
    });

    if (existedUser) {
      throw new HttpException('User already exists', HttpStatus.FORBIDDEN);
    }

    return this.prismaService.users.create({
      data: createUserDto,
    });
  }

  findAll() {
    return this.prismaService.users.findMany();
  }

  async findOne(id: string) {
    const user = await this.prismaService.users.findUnique({
      where: { id },
    });
    if (user) {
      return user;
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return this.prismaService.users.delete({
      where: { id },
    });
  }
}
