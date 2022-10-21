export class CreateTransactionDto {
  title: string;
  price: number;
  date: Date;
  categoriesId: number;
  userId: number;
}
