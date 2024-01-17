import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dto/criar-jpgador.dto';
import { Jogador } from './Interafaces/jogador.interface';
import * as uuid from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  private readonly logger = new Logger(JogadoresService.name);

  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criarJogadorDto;

    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (!jogadorEncontrado) {
      this.criar(criarJogadorDto);
    } else {
      this.atualizar(criarJogadorDto);
    }
  }

  async consultarJogadores(): Promise<Jogador[]> {
    return await this.jogadorModel.find().exec();
  }

  async consultarJogadorPorEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com e-mail ${email} não encontrado`);
    }

    return jogadorEncontrado;
  }

  async deletarJogador(email: string): Promise<any> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();
    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com e-mail ${email} não encontrado`);
    } else {
      return await this.jogadorModel.deleteOne({ email }).exec();
    }
  }

  private async criar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const jogadorCriado = new this.jogadorModel(criarJogadorDto);
    this.logger.log(`jogadorCriado: ${JSON.stringify(jogadorCriado)}`);

    return await jogadorCriado.save();
  }

  private async atualizar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    return await this.jogadorModel
      .findOneAndUpdate(
        { email: criarJogadorDto.email },
        { $set: criarJogadorDto },
      )
      .exec();
  }
}
