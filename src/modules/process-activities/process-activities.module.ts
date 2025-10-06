import { Module } from '@nestjs/common';
import { ProcessActivitiesService } from './process-activities.service';
import { ProcessActivitiesController } from './process-activities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CsvProfile } from '../campaigns/entities/csv_profiles.entity';
import { ProcessActivity } from './entities/process-activity.entity';

@Module({
   imports: [TypeOrmModule.forFeature([ProcessActivity, CsvProfile])],
  controllers: [ProcessActivitiesController],
  providers: [ProcessActivitiesService],
  exports: [ProcessActivitiesService],
})
export class ProcessActivitiesModule {}