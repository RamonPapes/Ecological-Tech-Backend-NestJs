import { Schema, Document, model } from 'mongoose';

export interface MemoryGame extends Document {
    time: number;// tempo em segundos  
    erros: number; // Erros na partida
}

export const MemoryGameSchema = new Schema<MemoryGame>(
  {
    time: { type: Number, default: 0 },
    erros: {type: Number, default: 0}
  },
);

export const MemoryGameModel = model<MemoryGame>('MemoryGame',MemoryGameSchema);