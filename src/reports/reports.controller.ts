import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Header,
  Headers,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto, QueryCreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto);
  }

  @Get()
  findAll(@Headers('user-id') userId: string, @Query('year') year: Date) {
    return this.reportsService.findAllByYear({ year, userId });
  }

  @Get('/transactions')
  findOne(
    @Headers('user-id') userId: string,
    @Query() query: QueryCreateReportDto,
  ) {
    return this.reportsService.findOne({ userId, query });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(+id, updateReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsService.remove(+id);
  }
}
