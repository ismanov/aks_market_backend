import { CustomersModule } from 'customers/customers.module';
import { Module } from '@nestjs/common';
import { AuthService } from 'auth/auth.service';
import { AuthController } from 'auth/auth.controller';

@Module({
  imports: [CustomersModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
