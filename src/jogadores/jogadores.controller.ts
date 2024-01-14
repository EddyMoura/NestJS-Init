import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CriarJogadorDto } from './dto/criar-jpgador.dto';
import { JogadoresService } from './jogadores.service';
import { Jogador } from './Interafaces/jogador.interface';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Post()
  async criarAtualizarJogador(
    @Body() criarJogadorDto: CriarJogadorDto,
  ): Promise<void> {
    await this.jogadoresService.criarAtualizarJogador(criarJogadorDto);
  }

  @Get()
  async consultarJogadores(
    @Query('email') email: string,
  ): Promise<Jogador | Jogador[]> {
    if (!email) {
      return this.jogadoresService.consultarJogadores();
    } else {
      return this.jogadoresService.consultarJogadorPorEmail(email);
    }
  }

  @Delete()
  async deletarJogador(@Query('email') email: string): Promise<void> {
    return this.jogadoresService.deletarJogador(email);
  }
}
