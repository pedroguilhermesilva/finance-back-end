export class CreateUserDto {
  email: string;
  name: string;
  salaryType: string;
  salaryOneDate: Date;
  salaryOneValue: number;
  salaryTwoDate?: Date;
  salaryTwoValue?: number;
}
