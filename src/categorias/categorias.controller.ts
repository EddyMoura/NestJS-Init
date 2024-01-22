import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriarCategoriaDto } from './dto/criar-categoria.dto';
import { Categoria } from './Interfaces/categoria.interface';
import { CategoriasService } from './categorias.service';

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
}
