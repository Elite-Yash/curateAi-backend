import { Module } from '@nestjs/common';
import { CrmService } from './crm.service';
import { CrmController } from './crm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crm } from './entities/crm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Crm])],
  controllers: [CrmController],
  providers: [CrmService],
  exports: [CrmService],
})
export class CrmModule {}
