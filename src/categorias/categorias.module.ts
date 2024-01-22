import { Module } from '@nestjs/common';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriasShema } from './Interfaces/categoria.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Categoria', schema: CategoriasShema }]),
  ],
  controllers: [CategoriasController],
  providers: [CategoriasService],
})
export class CategoriasModule {}
