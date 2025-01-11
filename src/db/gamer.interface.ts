import { GameEnum } from 'src/utils/const';
import { TGamer } from './schemas/gamer.schema';

export interface IGamer {
  createGamer(
    tgId: number,
    firstName: string,
    userName: string,
    game: string,
    currentScene: string,
  ): Promise<TGamer>;

  findGamerByTgId(tgId: number): Promise<TGamer>;

  addGame(gamerId: number, gameName: string, scene: string): Promise<TGamer>;

  setCurrentGame(gamerId: number, gameName: string): Promise<void>;

  clearCurrentGame(gamerId: number): Promise<void>;

  updateStep(gamerId: number, gameName: string, step: string): Promise<TGamer>;

  updatePoints(gamerId: number, gameName: string, points: number): Promise<TGamer>
}
