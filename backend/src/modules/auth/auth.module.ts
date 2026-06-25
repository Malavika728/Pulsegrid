import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

@Module({
  // DatabaseModule is @Global() so DatabaseService and FallbackDbService
  // are available everywhere without re-importing here.
  controllers: [AuthController],
})
export class AuthModule {}