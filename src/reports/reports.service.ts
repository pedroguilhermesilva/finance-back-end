import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { endOfYear, getMonth, startOfYear } from 'date-fns';

@Injectable()
export class ReportsService {
  constructor(private prismaService: PrismaService) {}
  create(createReportDto: CreateReportDto) {
    return 'This action adds a new report';
  }

  async findAllByYear({ year, userId }: CreateReportDto) {
    const startYear = startOfYear(new Date(year));
    const endYear = endOfYear(new Date(year));

    const getProfileId = await this.prismaService.profiles.findMany({
      where: {
        userId,
      },
    });

    const getReportByYear = await this.prismaService.transactions.findMany({
      include: {
        profile: {
          select: {
            salaryType: true,
            salaryOneDate: true,
            salaryTwoDate: true,
          },
        },
      },
      where: {
        date: {
          gte: startYear,
          lt: endYear,
        },
        profileId: getProfileId[0].id,
      },
    });

    var monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const groupsByMonths = getReportByYear.reduce((acc, current) => {
      const m = getMonth(current.date);

      acc[m]
        ? (acc[m].amount += Number(current.price))
        : (acc[m] = {
            month: String(monthNames[m]),
            amountInNumber: m + 1,
            amount: Number(current.price),
            salaryType: current.profile.salaryType,
            salaryOneDate: current.profile.salaryOneDate,
            salaryTwoDate: current.profile.salaryTwoDate
              ? current.profile.salaryTwoDate
              : null,
          });
      return acc;
    }, {});

    const result = Object.keys(groupsByMonths).map((key) => {
      return groupsByMonths[key];
    });

    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
