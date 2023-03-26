import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateReportDto, FindOneReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import {
  addDays,
  endOfYear,
  format,
  getDay,
  getDaysInMonth,
  getMonth,
  getYear,
  lastDayOfMonth,
  setMonth,
  setYear,
  startOfMonth,
  startOfYear,
} from 'date-fns';

interface CategoriesReports {
  id: string;
  title: string;
}

interface AllReports {
  categories: CategoriesReports;
  id: string;
  date: Date;
  price: string;
  title: string;
}
[];

@Injectable()
export class ReportsService {
  constructor(private prismaService: PrismaService) {}
  create(createReportDto: CreateReportDto) {
    return 'This action adds a new report';
  }

  setYearAndMonth(year: string, month: string, date: Date): Date {
    const changedYear = setYear(date, Number(year));
    return setMonth(changedYear, Number(month) - 1);
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

    const monthNames = [
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
            monthInNumber: m + 1,
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

  async findOne(findOneReportDto: FindOneReportDto) {
    const { query, userId } = findOneReportDto;
    const { date, month, year } = query;

    let reports: AllReports[];

    const getProfileId = await this.prismaService.profiles.findMany({
      where: {
        userId,
      },
    });

    if (date === 'all') {
      const getYearAndMonthDate = new Date(
        format(new Date(`${year}/${month}`), 'yyyy-MM-dd'),
      );

      const startMonth = startOfMonth(getYearAndMonthDate);
      const endMonth = lastDayOfMonth(getYearAndMonthDate);
      const getDaysMonth = getDaysInMonth(getYearAndMonthDate);

      const allReports = await this.prismaService.transactions.findMany({
        where: {
          profileId: getProfileId[0].id,
          date: {
            gte: startMonth,
            lte:
              getDaysMonth === getDay(endMonth)
                ? endMonth
                : addDays(endMonth, 1),
          },
        },
        select: {
          date: true,
          categories: {
            select: {
              title: true,
              id: true,
            },
          },
          price: true,
          id: true,
          title: true,
        },
      });

      reports = allReports;
    } else {
      if (getProfileId[0].salaryType === 'quinzenal') {
        let type: 'first' | 'second';

        const [daySelected, monthSelected, yearSelected] = date.split('/');

        const dateChanged = format(
          new Date(`${yearSelected}/${monthSelected}/${daySelected}`),
          'yyyy-MM-dd',
        );

        const firstOneWithRightYearAndMonth = format(
          this.setYearAndMonth(
            yearSelected,
            monthSelected,
            getProfileId[0].salaryOneDate,
          ),
          'yyyy-MM-dd',
        );

        const secondSalaryWithRightYear = format(
          this.setYearAndMonth(
            yearSelected,
            monthSelected,
            getProfileId[0].salaryTwoDate,
          ),
          'yyyy-MM-dd',
        );

        switch (dateChanged) {
          case firstOneWithRightYearAndMonth:
            type = 'first';
            break;
          case secondSalaryWithRightYear:
            type = 'second';
            break;
        }

        if (type === 'first') {
          const salaryOneDate = startOfMonth(
            new Date(firstOneWithRightYearAndMonth),
          );

          const secondSalaryOneDate = new Date(secondSalaryWithRightYear);
          const allReports = await this.prismaService.transactions.findMany({
            where: {
              profileId: getProfileId[0].id,
              date: {
                gte: salaryOneDate,
                lte: secondSalaryOneDate,
              },
            },
            select: {
              date: true,
              categories: {
                select: {
                  title: true,
                  id: true,
                },
              },
              price: true,
              id: true,
              title: true,
            },
          });

          reports = allReports;
        } else {
          const lastDayOfMonthSalaryDate = lastDayOfMonth(
            new Date(secondSalaryWithRightYear),
          );

          const getDaysMonth = getDaysInMonth(
            new Date(secondSalaryWithRightYear),
          );

          const secondSalaryOneDate = new Date(secondSalaryWithRightYear);

          const allReports = await this.prismaService.transactions.findMany({
            where: {
              profileId: getProfileId[0].id,
              date: {
                gte: secondSalaryOneDate,
                lte:
                  getDaysMonth === getDay(lastDayOfMonthSalaryDate)
                    ? lastDayOfMonthSalaryDate
                    : addDays(lastDayOfMonthSalaryDate, 1),
              },
            },
            select: {
              date: true,
              categories: {
                select: {
                  title: true,
                  id: true,
                },
              },
              price: true,
              id: true,
              title: true,
            },
          });

          reports = allReports;
        }
      }
    }

    return reports;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
