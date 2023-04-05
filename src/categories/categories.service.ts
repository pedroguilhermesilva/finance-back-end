import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const findUser = await this.prismaService.users.findUnique({
      where: {
        id: createCategoryDto.userId,
      },
      include: {
        profiles: true,
      },
    });

    return this.prismaService.categories.create({
      data: {
        title: createCategoryDto.title,
        date: createCategoryDto.date,
        profileId: findUser?.profiles[0].id,
      },
    });
  }

  async findAll(userId: string) {
    const profileId = await this.prismaService.profiles.findMany({
      where: {
        userId,
      },
    });

    return this.prismaService.categories.findMany({
      where: {
        profileId: profileId[0].id,
      },
    });
  }

  findOne(id: string) {
    return this.prismaService.categories.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
