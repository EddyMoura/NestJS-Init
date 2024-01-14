import * as mongoose from 'mongoose';

export const JogadorSchema = new mongoose.Schema(
  {
    telefone: { Type: String, unique: true },
    email: { Type: String, unique: true },
    nome: String,
    ranking: String,
    posicaoRanking: Number,
    urlFotoJogador: String,
  },
  { timestamps: true, collection: 'jogadores' },
);
