import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';

@Module({
  controllers: [TodosController],
  providers: [TodosService],
  exports: [TodosService], // Export service so it can be used by other modules
})
export class TodosModule {}
