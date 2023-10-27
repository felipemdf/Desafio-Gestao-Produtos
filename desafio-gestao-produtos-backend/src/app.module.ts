import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { dataSource } from './config/ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { LojasModule } from './resources/lojas/lojas.module';
import { ProdutosModule } from './resources/produtos/produtos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRoot(dataSource.options),
    LojasModule,
    ProdutosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
