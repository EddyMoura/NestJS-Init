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
import { JogadoresService } from 'src/jogadores/jogadores.service';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    private readonly jogadoresService: JogadoresService,
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

  async consultarCategorias(): Promise<Array<Categoria>> {
    return this.categoriaModel.find().populate('jogadores').exec();
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

  async atribuirCategoriaJogador(params: Array<string>): Promise<void> {
    const categoriaId = params['_id'];
    const jogadorId = params['_id'];

    const categoriaEncontrada = await this.encontrarCategoria(categoriaId);

    this.logger.log(
      `Categoria econtrada: ${JSON.stringify(categoriaEncontrada)}`,
    );

    const jogadorJaCadastradoCategoria = await this.categoriaModel
      .find(categoriaId)
      .where('jogadores')
      .in(jogadorId)
      .exec();

    await this.jogadoresService.consultarJogadorPorId(jogadorId);

    if (jogadorJaCadastradoCategoria.length > 0) {
      throw new BadRequestException(
        `Jogador ${jogadorId} já cadastrado na categoria de id: ${categoriaId}`,
      );
    }

    categoriaEncontrada.jogadores.push(jogadorId);

    await this.categoriaModel
      .findByIdAndUpdate(categoriaId, { $set: categoriaEncontrada })
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
