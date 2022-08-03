import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { TasksModule } from 'tasks/tasks.module';
import { ProductsModule } from 'products/products.module';
import { AuthModule } from 'auth/auth.module';
import { OrdersModule } from 'orders/orders.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    MongooseModule.forRoot(process.env.MONGODB_HOST),
    AuthModule,
    OrdersModule,
    ScheduleModule.forRoot(),
    TasksModule,
    ProductsModule,
    CategoriesModule,
  ],
})
export class AppModule {}
