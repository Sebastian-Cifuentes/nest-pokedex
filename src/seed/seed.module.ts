import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [HttpModule]
})
export class SeedModule {}
