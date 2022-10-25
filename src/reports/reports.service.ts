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

    // const test = getReportByYear.map((report) => {
    //   console.log({ ...report, month: `${getMonth(report['date']) + 1}` });
    // });

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

    var map_result = getReportByYear.map((item) => {
      var month = monthNames[getMonth(item.date)];
      return {
        Month: month,
      };
    });

    // console.log(map_result);

    const groups = getReportByYear.reduce(function (r, o) {
      var m = getMonth(o.date);
      r[m]
        ? r[m].data.push(o)
        : (r[m] = { group: String(monthNames[m]), data: [o] });
      return r;
    }, {});

    var result = Object.keys(groups).map(function (k) {
      return groups[k];
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
