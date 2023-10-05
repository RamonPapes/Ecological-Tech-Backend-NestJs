import { Schema, Document, Types } from 'mongoose';
import { MemoryGame, MemoryGameSchema } from 'src/games/memory-game/memory-game.model';
import { WordSearchGame, WordSearchGameSchema } from 'src/games/word-search-game/word-search-game.model';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date; 
  achievements: Achievement[];
  memoryGames: MemoryGame[];
  wordSearchGames: WordSearchGame[]; 
}

export const UserSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    achievements: [{name: String, date: Date}],
    memoryGames: [MemoryGameSchema], // Matriz de jogos da memória incorporados
    wordSearchGames: [WordSearchGameSchema], // Matriz de jogos da memória incorporados
  },
  { timestamps: true },
);

interface Achievement{
  name: String;
  date: Date;
}
