export class CreateTransactionDto {
  title: string;
  price: string;
  installments: boolean;
  quantity: string;
  date: Date;
  categoryId: string;
  userId: string;
}
