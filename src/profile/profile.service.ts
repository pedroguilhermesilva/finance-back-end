import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private prismaService: PrismaService) {}
  async create({
    salaryType,
    salaryOneDate,
    salaryOneValue,
    salaryTwoDate,
    salaryTwoValue,
    userId,
  }: CreateProfileDto) {
    const profileAlreadyExists = await this.findOne(userId);

    if (profileAlreadyExists.length <= 0) {
      const profileCreated = await this.prismaService.profiles.create({
        data: {
          userId,
          salaryType,
          salaryOneDate,
          salaryOneValue,
          salaryTwoDate: salaryTwoDate ? salaryTwoDate : null,
          salaryTwoValue: salaryTwoValue ? salaryTwoValue : null,
        },
        include: {
          user: {
            select: {
              email: true,
              image: true,
              name: true,
            },
          },
        },
      });

      delete profileCreated.userId;

      return profileCreated;
    } else {
      throw new HttpException('Profile already existed!', HttpStatus.CONFLICT);
    }
  }

  findAll() {
    return this.prismaService.profiles.findMany();
  }

  findOne(id: string) {
    return this.prismaService.profiles.findMany({
      where: {
        userId: id,
      },
    });
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
