import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categoria } from './Interfaces/categoria.interface';
import { CriarCategoriaDto } from './dto/criar-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
  ) {}

  private readonly logger = new Logger(CategoriasService.name);

  async criarCategoria(
    criarCategoriaDto: CriarCategoriaDto,
  ): Promise<Categoria> {
    const { categoria } = criarCategoriaDto;

    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (categoriaEncontrada) {
      throw new BadRequestException(`Categoria ${categoria} já cadastrada`);
    }

    const categoriaCriada = new this.categoriaModel(criarCategoriaDto);
    this.logger.log(`Categoria criada: ${JSON.stringify(categoriaCriada)}`);

    return await categoriaCriada.save();
  }
}
