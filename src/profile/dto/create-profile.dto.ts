export class CreateProfileDto {
  userId: string;
  salaryType: 'quinzenal' | 'mensal';
  salaryOneDate: Date;
  salaryOneValue: number;
  salaryTwoDate?: Date;
  salaryTwoValue?: number;
}
