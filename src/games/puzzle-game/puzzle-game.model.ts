import { Schema, Document, model } from 'mongoose';

export interface PuzzleGame extends Document {
    turns: number;
}

export const PuzzleGameSchema = new Schema<PuzzleGame>(
    {
        turns: { type: Number, required: true }
    },
);

export const PuzzleGameModel = model<PuzzleGame>('PuzzleGame', PuzzleGameSchema);