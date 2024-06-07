import { TFactRecord } from './schemas/fact.schema';
import { TJokeRecord } from './schemas/joke.schema';

export interface IBook {
  createFactRecord(
    author: string,
    tgId: number,
    text: string,
  ): Promise<TFactRecord>;
  createJokeRecord(
    author: string,
    tgId: number,
    text: string,
  ): Promise<TJokeRecord>;
  getRandomFact(): Promise<TFactRecord>;
  getRandomJoke(): Promise<TJokeRecord>;
}
