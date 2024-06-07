import { TUser } from './schemas/user.schema';

export interface IUser {
  createUser(tgId: number, firstName: string, userName: string): Promise<TUser>;
  findUserByTgId(tgId: number): Promise<TUser>;
}
