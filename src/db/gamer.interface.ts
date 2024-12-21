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
}
