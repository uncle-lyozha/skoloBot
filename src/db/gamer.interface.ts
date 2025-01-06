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

  addGame(gamerId: number, gameName: GameEnum, scene: string): Promise<TGamer>;

  updateStep(gamerId: number, gameName: GameEnum, step: string): Promise<TGamer>;

  updatePoints(gamerId: number, gameName: GameEnum, points: number): Promise<TGamer>
}
