import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GamerSchemaClass, TGamer } from './schemas/gamer.schema';
import { IGamer } from './gamer.interface';

@Injectable()
export class GamerRepositoryClass implements IGamer {
  constructor(
    @InjectModel('Gamer') private readonly gamerModel: Model<GamerSchemaClass>,
  ) {}

  async createGamer(
    tgId: number,
    firstName: string,
    userName: string,
    gameName: string,
    currentScene: string,
  ): Promise<TGamer> {
    const newGamer = new this.gamerModel({
      tgId: tgId,
      first_name: firstName,
      username: userName,
      game: {
        name: gameName,
        currentScene: currentScene,
      },
    });
    const result = await newGamer.save();
    return result;
  }

  async findGamerByTgId(tgId: number): Promise<TGamer> {
    const gamer = await this.gamerModel.findById(tgId);
    return gamer;
  }
}
