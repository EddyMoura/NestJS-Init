import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CriarCategoriaDto } from './dto/criar-categoria.dto';
import { Categoria } from './Interfaces/categoria.interface';
import { CategoriasService } from './categorias.service';
import { CategoriasValidacaoParametrosPipe } from './pipes/categorias-validacao-parametros.pipe';
import { AtualizarCategoriaDto } from './dto/atualizar-categoria.dto';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarCategoria(
    @Body() criarCategoriaDto: CriarCategoriaDto,
  ): Promise<Categoria> {
    return this.categoriasService.criarCategoria(criarCategoriaDto);
  }

  @Get()
  async consultarCategorias(): Promise<Array<Categoria>> {
    return this.categoriasService.consultarCategorias();
  }

  @Get('/:_id')
  async consultarCategoriaPorId(
    @Param('_id', CategoriasValidacaoParametrosPipe)
    _id: string,
  ): Promise<Categoria> {
    return this.categoriasService.consultarCategoriaPorId(_id);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarCategoria(
    @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
    @Param('_id', CategoriasValidacaoParametrosPipe) _id: string,
  ): Promise<void> {
    await this.categoriasService.atualizarCategoria(_id, atualizarCategoriaDto);
  }

  @Put('/:_id/jogadores/:jogadorId')
  async atribuirCategoriaJogador(
    @Param(CategoriasValidacaoParametrosPipe) params: Array<string>,
  ): Promise<void> {
    await this.categoriasService.atribuirCategoriaJogador(params);
  }
}
