import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FactRecord, TFactRecord } from './schemas/fact.schema';
import { JokeRecord, TJokeRecord } from './schemas/joke.schema';
import { IBook } from './book.interface';

@Injectable()
export class BookRepositoryClass implements IBook {
  constructor(
    @InjectModel('Fact') private readonly factModel: Model<FactRecord>,
    @InjectModel('Joke') private readonly jokeModel: Model<JokeRecord>,
  ) {}

  async createFactRecord(
    author: string,
    tgId: number,
    text: string,
  ): Promise<TFactRecord> {
    const newFact = new this.factModel({
      author: author,
      tgId: tgId,
      text: text,
    });
    const result: TFactRecord = await newFact.save();
    return result;
  }

  async createJokeRecord(
    author: string,
    tgId: number,
    text: string,
  ): Promise<TJokeRecord> {
    const newJoke = new this.jokeModel({
      author: author,
      tgId: tgId,
      text: text,
    });
    const result = await newJoke.save();
    return result
  }

  async getRandomFact(): Promise<TFactRecord> {
    const [randomFact] = await this.factModel.aggregate([
      { $sample: { size: 1 } },
    ]);
    return randomFact;
  }

  async getRandomJoke(): Promise<TJokeRecord> {
    const [randomJoke] = await this.jokeModel.aggregate([
      { $sample: { size: 1 } },
    ]);
    return randomJoke;
  }
}
