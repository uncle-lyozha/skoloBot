import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TUser, UserSchemaClass } from './schemas/user.schema';
import { IUser } from './user.interface';

@Injectable()
export class UserRepositoryClass implements IUser {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserSchemaClass>,
  ) {}

  async createUser(
    tgId: number,
    firstName: string,
    userName: string,
  ): Promise<TUser> {
    const newUser = new this.userModel({
      tgId: tgId,
      first_name: firstName,
      username: userName,
    });
    const result: TUser = await newUser.save();
    return result;
  }

  async findUserByTgId(tgId: number): Promise<TUser> {
    const user: TUser = await this.userModel.findOne({
      tgId: tgId,
    });
    return user;
  }
}
