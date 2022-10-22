import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ProfileModule } from './profile/profile.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [UsersModule, CategoriesModule, TransactionsModule, ProfileModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
