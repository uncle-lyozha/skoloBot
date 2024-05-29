import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FactRecord } from './schemas/fact.schema';
import { JokeRecord } from './schemas/joke.schema';
import { RecordType } from 'src/utils/types';

@Injectable()
export class BookRepositoryClass {
  constructor(
    @InjectModel('Fact') private readonly factModel: Model<FactRecord>,
    @InjectModel('Joke') private readonly jokeModel: Model<JokeRecord>,
  ) {}

  async createFactRecord(
    author: string,
    tgId: number,
    text: string,
  ): Promise<void> {
    const newFact = new this.factModel({
      author: author,
      tgId: tgId,
      text: text,
    });
    const result = await newFact.save();
    if (result) {
      console.log(`New fact saved: ${result}`);
    } else {
      console.error(`DB ERROR, failed to create a fact record: ${text}.`);
    }
  }

  async createJokeRecord(
    author: string,
    tgId: number,
    text: string,
  ): Promise<void> {
    const newJoke = new this.jokeModel({
      author: author,
      tgId: tgId,
      text: text,
    });
    const result = await newJoke.save();
    if (result) {
      console.log(`New joke saved: ${result}`);
    } else {
      console.error(`DB ERROR, failed to create a joke record: ${text}.`);
    }
  }

  async getRandomFact(): Promise<RecordType> {
    const [randomFact] = await this.factModel.aggregate([{ $sample: { size: 1 } }]);
    return randomFact;
  }

  async getRandomJoke(): Promise<RecordType> {
    const [randomJoke] = await this.jokeModel.aggregate([{ $sample: { size: 1 } }]);
    return randomJoke;
  }
}
