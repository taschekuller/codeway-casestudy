import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
  ],
  providers: [],
  exports: [PassportModule],
})
export class AuthModule { }