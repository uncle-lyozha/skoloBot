import { Injectable } from '@nestjs/common';
import { Ctx, Hears, InjectBot, On, Update } from 'nestjs-telegraf';
import { UserRepositoryClass } from 'src/db/user.repository';
import { Context, Telegraf } from 'telegraf';
import * as notValidatedJson from '../utils/script.json';
import { ScriptType } from 'src/utils/types';

@Injectable()
@Update()
export class ListenerClass {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly userRep: UserRepositoryClass,
  ) {}

  private script: ScriptType = notValidatedJson;

  @On('new_chat_members')
  async greetNewMember(@Ctx() ctx: Context) {
    const update = ctx.message;
    const newMembers =
      'new_chat_members' in update ? update.new_chat_members : null;
    for (const user of newMembers) {
      const tgUsername = '@' + user.username;
      const userTgId = user.id;
      const savedUser = await this.userRep.findUserByTgId(userTgId);
      if (savedUser) {
        console.log('We have seen this guy before: ' + tgUsername);
        await ctx.reply(this.script.greetings.hi + tgUsername + '!');
        await ctx.reply(this.script.greetings.secondary);
      } else {
        await ctx.reply(this.script.greetings.hi + tgUsername + '!');
        await ctx.reply(this.script.greetings.first);
        await this.userRep.createUser(user.id, user.first_name, user.username);
      }
    }
  }

  @Hears(['shit', 'Shit', 'poop', 'Poop', 'Говно', 'говно'])
  async onShit(@Ctx() ctx: Context) {
    await ctx.reply('💩');
  }

  @On('photo')
  async onPic(@Ctx() ctx: Context) {
    if(Math.random() > 0.85) {
      await ctx.react('💩');
    } else {
      return;
    }
  }
}
