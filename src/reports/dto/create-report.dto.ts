export class CreateReportDto {
  year: Date;
  userId: string;
}

export class QueryCreateReportDto {
  date: string;
  month?: string;
  year?: string;
}

export class FindOneReportDto {
  query: QueryCreateReportDto;
  userId: string;
}
