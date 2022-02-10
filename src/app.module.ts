import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { CustomersModule } from './customers/customers.module';
import { TasksModule } from './tasks/tasks.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    MongooseModule.forRoot(process.env.MONGODB_HOST),
    CustomersModule,
    ScheduleModule.forRoot(),
    TasksModule,
    ProductsModule,
  ],
})
export class AppModule {}
