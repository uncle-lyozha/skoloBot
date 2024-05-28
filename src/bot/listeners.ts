import { Injectable } from '@nestjs/common';
import { Ctx, InjectBot, On, Update } from 'nestjs-telegraf';
import { UserRepositoryClass } from 'src/db/user.repository';
import { Context, Telegraf } from 'telegraf';

@Injectable()
@Update()
export class ListenerClass {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly userRep: UserRepositoryClass,
  ) {}

  @On('new_chat_members')
  async greetNewMember(@Ctx() ctx: Context) {
    const update = ctx.message;
    const newMembers =
      'new_chat_members' in update ? update.new_chat_members : null;
    for (const user of newMembers) {
      const userTgId = user.id;
      const savedUser = await this.userRep.findUserByTgId(userTgId);
      if (savedUser) {
        console.log('We have seen this guy before: ' + user.username);
        await ctx.reply(
          `Welcome back @${user.username}. I remember you. You are ok, c'mon in.`,
        );
      } else {
        await ctx.reply(`Greetings @${user.username} and welcome!`);
        await this.userRep.createUser(user.id, user.first_name, user.username);
      }
    }
  }
}
