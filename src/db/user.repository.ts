import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserSchemaClass } from './schemas/user.schema';
import { UserType } from '../utils/types';

@Injectable()
export class UserRepositoryClass {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserSchemaClass>,
  ) {}

  async createUser(
    tgId: number,
    firstName: string,
    userName: string,
  ): Promise<void> {
    const newUser = new this.userModel({
      tgId: tgId,
      first_name: firstName,
      username: userName,
    });
    if (!newUser) {
      console.error(`DB ERROR, failed to create user ${userName}.`);
    }
    const result = await newUser.save();
    console.log(`New user created:\n ` + result);
  }

  async findUserByTgId(tgId: number): Promise<UserType> {
    const user = await this.userModel.findOne({
      tgId: tgId,
    });
    return user;
  }
}
