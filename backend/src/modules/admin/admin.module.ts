import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';

@Module({
  // DatabaseModule is @Global() so DatabaseService and FallbackDbService
  // are injected automatically into AdminController without importing here.
  controllers: [AdminController],
})
export class AdminModule {}