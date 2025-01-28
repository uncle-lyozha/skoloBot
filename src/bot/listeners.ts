import { Injectable } from '@nestjs/common';
import {
  Action,
  Ctx,
  Hears,
  InjectBot,
  On,
  Sender,
  Update,
} from 'nestjs-telegraf';
import { UserRepositoryClass } from 'src/db/user.repository';
import { Context, Telegraf } from 'telegraf';
import { Update as TypeGramUpdate } from 'telegraf/typings/core/types/typegram';
import * as notValidatedJson from '../utils/script.json';
import { ScriptType } from 'src/utils/types';
import { SceneContext } from 'telegraf/typings/scenes';
import { GameEnum } from 'src/utils/const';
import { TGamer } from 'src/db/schemas/gamer.schema';
import { GamerRepositoryClass } from 'src/db/gamer.repository';

@Injectable()
@Update()
export class ListenerClass {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly userRep: UserRepositoryClass,
    private readonly gamerRep: GamerRepositoryClass,
  ) {}

  private script: ScriptType = notValidatedJson;

  @On('new_chat_members')
  async greetNewMember(@Ctx() ctx: Context) {
    const update = ctx.message;
    const newMembers =
      'new_chat_members' in update ? update.new_chat_members : null;
    const skolHeartSticker = await ctx.sendSticker(
      'CAACAgIAAxkBAAIJlWZjLcEogQfuwNYM6z54RSFL8lBWAAIBAAP1orgb_3Txv0gPw3E1BA',
    );
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
    if (Math.random() > 0.99) {
      await ctx.react('💩');
    } else {
      return;
    }
  }

  @Action(/^game/)
  async onGame(
    @Ctx() ctx: SceneContext & { update: TypeGramUpdate.CallbackQueryUpdate },
    @Sender('id') id: number,
    @Sender('username') userName: string,
  ) {
    const cbQuery = ctx.update.callback_query;
    const cbData = 'data' in cbQuery ? cbQuery.data : null;
    // const stepType = cbData.split(':')[0];
    const gameName: string = cbData.split(':')[1];
    const firstStep = 'story:start';
    let gamer: TGamer = await this.gamerRep.findGamerByTgId(id);
    if (!gamer) {
      gamer = await this.gamerRep.createGamer(
        id,
        userName,
        gameName,
        firstStep,
      );
    }
    if (!gamer.games.get(gameName)) {
      await this.gamerRep.addGame(id, gameName, firstStep);
    } 
    if (gamer.currentGame === '') {
      await this.gamerRep.setCurrentGame(id, gameName);
    }
    await ctx.scene.enter('game');
  }
}
