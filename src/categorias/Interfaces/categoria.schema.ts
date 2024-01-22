import * as mongoose from 'mongoose';

export const CategoriasShema = new mongoose.Schema(
  {
    categoria: { type: String, unique: true },
    descricao: { type: String },
    eventos: [
      {
        nome: { type: String },
        operacao: { type: String },
        valor: { type: String },
      },
    ],
    jogadores: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Jogador',
      },
    ],
  },
  { timestamps: true, collection: 'categorias' },
);
