import { MemoryGame, MemoryGameSchema } from 'games/memory-game/memory-game.model';
import { PuzzleGame, PuzzleGameSchema } from 'games/puzzle-game/puzzle-game.model';
import { WordSearchGame, WordSearchGameSchema } from 'games/word-search-game/word-search-game.model';
import { Schema, Document, Types } from 'mongoose';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date; 
  achievements: Achievement[];
  memoryGames: MemoryGame[];
  wordSearchGames: WordSearchGame[];
  puzzleGames: PuzzleGame[]; 
}

export const UserSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    achievements: [{name: String, date: Date}],
    memoryGames: [MemoryGameSchema], // Matriz de jogos da memória incorporados
    wordSearchGames: [WordSearchGameSchema], // Matriz de jogos da memória incorporados
    puzzleGames: [PuzzleGameSchema],
  },
  { timestamps: true },
);

interface Achievement{
  name: String;
  date: Date;
}
