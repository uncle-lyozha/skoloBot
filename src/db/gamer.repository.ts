import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GamerSchemaClass, TGamer } from './schemas/gamer.schema';
import { IGamer } from './gamer.interface';
import { GameEnum } from 'src/utils/const';

@Injectable()
export class GamerRepositoryClass implements IGamer {
  constructor(
    @InjectModel('Gamer') private readonly gamerModel: Model<GamerSchemaClass>,
  ) {}

  async createGamer(
    tgId: number,
    gamerName: string,
    gameName: string,
    step: string,
  ): Promise<TGamer> {
    const newGamer = new this.gamerModel({
      tgId: tgId,
      gamerName: gamerName,
      currentGame: gameName,
      games: {
        [gameName]: { step },
      },
    });
    const result = await newGamer.save();
    return result;
  }

  async findGamerByTgId(tgId: number): Promise<TGamer> {
    const gamer: TGamer = await this.gamerModel.findOne({ tgId: tgId });
    return gamer;
  }

  async addGame(
    gamerId: number,
    gameName: string,
    scene: string,
  ): Promise<TGamer> {
    const gamer: TGamer = await this.gamerModel.findOneAndUpdate(
      { tgId: gamerId },
      {
        $set: {
          [`games.${gameName}`]: { scene },
        },
      },
    );
    return gamer;
  }

  async setCurrentGame(gamerId: number, gameName: string) {
    const gamer: TGamer = await this.gamerModel.findOneAndUpdate(
      { tgId: gamerId },
      {
        $set: {
          ['currentGame']: gameName,
        },
      },
    );
  }

  async clearCurrentGame(gamerId: number) {
    await this.gamerModel.findOneAndUpdate(
      { tgId: gamerId },
      {
        $set: {
          ['currentGame']: '',
        },
      },
    );
  }

  async updateStep(gamerId: number, gameName: string, step: string) {
    return await this.gamerModel
      .findOneAndUpdate(
        { tgId: gamerId, [`games.${gameName}`]: { $exists: true } },
        {
          $set: {
            [`games.${gameName}.scene`]: step,
          },
        },
        { new: true },
      )
      .exec();
  }

  async updatePoints(
    gamerId: number,
    gameName: string,
    points: number,
  ): Promise<TGamer> {
    return await this.gamerModel
      .findOneAndUpdate(
        { tgId: gamerId, [`games.${gameName}`]: { $exists: true } },
        {
          $inc: {
            [`games.${gameName}.points`]: points,
          },
        },
        { new: true },
      )
      .exec();
  }

  async updateGamerParam(
    gamerId: number,
    gameName: GameEnum,
    param: string,
    val: number | string,
  ) {
    const gamer = await this.gamerModel
      .findOneAndUpdate(
        { tgId: gamerId, [`games.${gameName}`]: { $exists: true } },
        {
          $set: {
            [`games.${gameName}.${param}`]: val,
          },
        },
        { new: true },
      )
      .exec();
    console.log(gamer);
    return gamer;
  }
}
