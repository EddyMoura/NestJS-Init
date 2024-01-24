import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categoria } from './Interfaces/categoria.interface';
import { CriarCategoriaDto } from './dto/criar-categoria.dto';
import { AtualizarCategoriaDto } from './dto/atualizar-categoria.dto';

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

    const categoriaExistente = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (categoriaExistente) {
      throw new ConflictException(`Categoria ${categoria} já cadastrada`);
    }

    const categoriaCriada = await this.categoriaModel.create(criarCategoriaDto);
    this.logger.log(`Categoria criada: ${JSON.stringify(categoriaCriada)}`);

    return categoriaCriada;
  }

  async consultarCategorias(): Promise<Categoria[]> {
    return this.categoriaModel.find().exec();
  }

  async consultarCategoriaPorId(_id: string): Promise<Categoria> {
    return this.encontrarCategoria(_id);
  }

  async atualizarCategoria(
    _id: string,
    atualizarCategoriaDto: AtualizarCategoriaDto,
  ): Promise<void> {
    await this.encontrarCategoria(_id);

    this.logger.log(`Categoria atualizada: ${_id}`);

    await this.categoriaModel
      .findByIdAndUpdate(_id, { $set: atualizarCategoriaDto })
      .exec();
  }

  private async encontrarCategoria(_id: string): Promise<Categoria> {
    const categoriaEncontrada = await this.categoriaModel
      .findOne({ _id })
      .exec();

    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria com o _id: ${_id} não encontrada`);
    }

    return categoriaEncontrada;
  }
}
