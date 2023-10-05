import { Schema, Document, model } from 'mongoose';

export interface WordSearchGame extends Document {
    time: number;// tempo em segundos  
    erros: number; // Erros na partida
  // Outros campos relacionados ao jogo da memória
}

export const WordSearchGameSchema = new Schema<WordSearchGame>(
  {
    time: { type: Number, default: 0 },
    erros: {type: Number, default: 0}
    // Defina outros campos conforme necessário
  }
);

export const WordSearchGameModel = model<WordSearchGame>('WordSearchGame',WordSearchGameSchema);