import { Schema, Document, model } from 'mongoose';

export interface MemoryGame extends Document {
    time: number;// tempo em segundos  
    erros: number; // Erros na partida
  // Outros campos relacionados ao jogo da memória
}

export const MemoryGameSchema = new Schema<MemoryGame>(
  {
    time: { type: Number, default: 0 },
    erros: {type: Number, default: 0}
    // Defina outros campos conforme necessário
  },
);

export const MemoryGameModel = model<MemoryGame>('MemoryGame',MemoryGameSchema);