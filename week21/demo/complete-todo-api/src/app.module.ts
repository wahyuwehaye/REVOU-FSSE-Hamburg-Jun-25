import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [TodosModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
