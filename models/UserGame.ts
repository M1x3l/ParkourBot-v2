import { model, Schema } from 'mongoose';

const UserGame = new Schema({
	guildID: { type: String, required: true },
	userID: { type: String, required: true, unique: true },
	gameName: { type: String, required: true },
});

export const UserGameModel = model('UserGame', UserGame);

export interface UserGameData {
	guildID: string;
	userID: string;
	gameName: string;
}
